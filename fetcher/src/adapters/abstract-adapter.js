/* eslint-disable guard-for-in */
import { createLogger } from '@nomisma/nomisma-logger';
import { client as WebSocketClient } from 'websocket';
import {
  CfdMappingSymbolsData,
  CfdQuasiLiveData,
  CfdScrapingData,
  CfdUnmatchedSymbolsData,
  CfdExpiryDatesMappingData,
  CfdInterestRatesFundingOfferData,
  CfdFundingOfferTailoredData,
  CfdCrossCurrencyBasisData,
  CfdDefaultRecoveryUponData,
  CfdRequiredInitialMarginData,
  CfdRequiredMarginData,
  connect as DbConnect,
} from 'price-aggregation-db';
import _ from 'lodash';
import dateFormat from 'date-fns/format';
import addDays from 'date-fns/add_days';

import expiryInterpolation from '../utils/expiryInterpolation';
import { Cron } from '../lib/cron';
import environment from '../../environment';

const logger = createLogger(4);

const defaultIntervalInDays = 10;

const { cron: cronConfig } = environment;

export class AbstractAdapter {
  constructor(name) {
    // Set adapter name
    this.adapterName = name;
    this.fields = [];
    // Adapter instruments
    this.adapterInstruments = {};
    // Nomisma instruments
    this.instruments = {};
    // Handlers
    this.liveDataHandler = null;
    this.quasiDataHandler = null;
    // Keep prev ask/bid data
    this.prevBidAsk = {};
    // Rules persist quasi data
    this.rulesPersistQuasiData = [];
    this.scrapingFields = [];
    // Socket
    this.socketUrl = null;
    this.connection = null;
    // Set logger
    this.logger = logger;
    // Initial event
    this.initialEvent = { name: 'initial' };
    // Scraping Data
    this.scrapingData = {};
    // Symbols Map
    this.symbolsMap = {};
    // Expiry Dates Map
    this.cfdSettingsMap = {};
    this.expiryDatesMap = {};
    this.interestRatesFundingOfferMap = {};
    this.fundingOfferTailoredMap = {};
    this.crossCurrencyBasisMap = {};
    this.recoveryMap = {};
    this.requiredMarginMap = {};
    // Cron
    this.cron = new Cron();
  }

  async initialize() {
    this.db = await DbConnect();
    // Load data maps
    await this.loadDataMaps();
    // Setup Websocket
    this.ws = this.setupWebsocket();
    // Setup Cron Jobs
    this.setupCronJobs();
  }

  async loadDataMaps() {
    this.cfdSettingsMap = await this.db.collection('cfd-settings').findOne({ section: 'common' });
    // Get scraping data
    this.scrapingData = await this.getScrapingData();
    // Get symbols map
    this.symbolsMap = await this.getSymbolsMap();
    // Get Expiry Dates Map
    this.expiryDatesMap = await this.getExpiryDatesMap();
    this.interestRatesFundingOfferMap = await this.getInterestRatesFundingOfferMap();
    this.fundingOfferTailoredMap = await this.getFundingOfferTailoredMap();
    this.crossCurrencyBasisMap = await this.getCrossCurrencyBasisMap();
    this.recoveryMap = await this.getRecoveryMap();
    this.requiredMarginMap = await this.getRequiredMarginMap();
  }

  async subscribe() {
    // Get instruments
    this.adapterInstruments = await this.getInstruments();
    // Persist instruments on start
    await this.persistInstruments({
      instruments: this.adapterInstruments,
      mapData: true,
    });
    // Connect to websocket
    this.connect();
  }

  onConnect() {
    // heartbeat
    if (this.startHeartbeat) {
      this.startHeartbeat();
    }
    // Starts subscription
    this.subscribeInstruments(Object.keys(this.adapterInstruments));
  }

  setupWebsocket() {
    const ws = new WebSocketClient();

    ws.on('connect', (connection) => {
      this.logDebug('connected');

      // Set connection
      this.setConnection(connection);

      // On message
      connection.on('message', async (message) => {
        try {
          const event = JSON.parse(message.utf8Data);
          this.tick({ event });
        } catch (error) {
          this.logDebug(`${message.utf8Data}`);
        }
      });

      // On error
      connection.on('error', (error) => {
        this.reconnect(error);
      });

      // On close
      connection.on('close', () => {
        this.reconnect();
      });

      // On connect
      this.onConnect();
    });

    ws.on('connectFailed', (error) => {
      this.reconnect(error);
    });

    return ws;
  }

  setupCronJobs() {
    // 8:00am UTC
    this.cron.add(
      'Daily match instruments',
      cronConfig.CRON_DAILY_MATCH_INSTRUMENTS,
      async (task) => {
        this.scrapingData = await this.getScrapingData();
        const result = await this.matchInstruments();
        this.logDebug(`DCSD result is ${result.matched} matched and ${result.unmatched} unmatched`);
        this.logDebug(`TASK "${task.name}" finished`);
      },
    );
    // 7:30am UTC
    this.cron.add(
      'Daily check instruments',
      cronConfig.CRON_DAILY_CHECK_INSTRUMENTS,
      async (task) => {
        await this.updatingInstrumentsJob();
        this.logDebug(`TASK "${task.name}" finished`);
      },
    );
    // Quasi data update
    this.rulesPersistQuasiData.forEach((rule) => {
      this.cron.add(`Quasi data updating ${rule.name}`, rule.cronExpr, async (task) => {
        await this.persistInstruments({
          instruments: this.instruments,
          fields: rule.fields,
          mapData: false,
          event: rule,
        });
        this.logDebug(`TASK "${task.name}" finished`);
      });
    });
    // Ping/Pong
    this.cron.add('ping/pong', '30 * * * * *', async () => {
      if (this.ping) {
        this.ping();
      }
    });
  }

  setLiveDataHandler(liveDataHandler) {
    this.liveDataHandler = liveDataHandler;
  }

  setQuasiDataHandler(quasiDataHandler) {
    this.quasiDataHandler = quasiDataHandler;
  }

  connect(socketUrl) {
    if (socketUrl) {
      this.socketUrl = socketUrl;
    }
    return this.ws.connect(this.socketUrl);
  }

  reconnect(error) {
    this.logError(`connection failed ${error && error.toString()}. Try reconnect...`);
    return setTimeout(() => this.connect(), 1000 * 1);
  }

  setConnection(connection) {
    this.connection = connection;
  }

  getConnection() {
    return this.connection;
  }

  getCurrentInstuments() {
    return this.instruments;
  }

  handleTickData(data) {
    const prevInstrument = this.adapterInstruments[data.symbol];
    if (prevInstrument) {
      const instrument = this.mapTickerToDoc({ ...prevInstrument, ...data });
      this.instruments[instrument.symbol] = instrument;
      if (this.liveDataHandler) {
        try {
          const { offer = 0, bid = 0 } = this.prevBidAsk[instrument.symbol] || {};
          if (instrument.offer !== offer || instrument.bid !== bid) {
            this.liveDataHandler(instrument);
            this.logDebug(
              `LIVE ${instrument.symbol} ${bid} -> ${instrument.bid} ${offer} -> ${instrument.offer}`,
            );
            this.prevBidAsk[instrument.symbol] = {
              offer: instrument.offer,
              bid: instrument.bid,
            };
          }
        } catch (err) {
          this.logError(err.message);
        }
      }
    }
  }

  async persistInstruments(params = {}) {
    const {
      instruments = {}, mapData = true, fields = [], event = this.initialEvent,
    } = params;
    if (this.quasiDataHandler) {
      const quasiDataHandlerPromises = [];
      Object.keys(instruments).forEach((symbol) => {
        let instrument = mapData ? this.mapTickerToDoc(instruments[symbol]) : instruments[symbol];
        if (fields && fields.length) {
          instrument = _.pick(instrument, ['symbol', 'serviceName'].concat(fields));
        }
        quasiDataHandlerPromises.push(this.quasiDataHandler(instrument, event));
        this.logDebug(`QUASI "${event.name}" ${instrument.symbol}`);
      });
      await Promise.all(quasiDataHandlerPromises);
    }
  }

  async updatingInstrumentsJob() {
    // Get new instruments
    const instruments = await this.getInstruments();
    // Get new symbols
    const newSymbols = _.difference(Object.keys(instruments), Object.keys(this.adapterInstruments));
    // Get old symbols
    const oldSymbols = _.difference(Object.keys(this.adapterInstruments), Object.keys(instruments));
    // unsubscribe
    await this.unsubscribeInstruments(oldSymbols);
    // subscribe
    await this.subscribeInstruments(newSymbols);
    // Update new adapter instruments
    this.adapterInstruments = instruments;
    // Persist instruments after updated instruments from API
    await this.persistInstruments({
      instruments: this.adapterInstruments,
      mapData: true,
    });
  }

  send(query) {
    const connection = this.getConnection();
    if (connection) {
      connection.send(JSON.stringify(query));
    }
  }

  async getSymbolsMap() {
    const data = await CfdMappingSymbolsData.find({ serviceName: this.adapterName });
    return data.reduce((prev, o) => ({ ...prev, [o.serviceSymbol]: o }), {});
  }

  async getExpiryDatesMap() {
    const data = await CfdExpiryDatesMappingData.find();
    return data.reduce((prev, o) => ({ ...prev, [o.contract]: o }), {});
  }

  async getInterestRatesFundingOfferMap() {
    const data = await CfdInterestRatesFundingOfferData.find();
    return data.reduce((prev, o) => ({ ...prev, [o.expiry]: o }), {});
  }

  async getFundingOfferTailoredMap() {
    const data = await CfdFundingOfferTailoredData.find();
    return data.reduce((prev, o) => ({ ...prev, [o.currency]: o }), {});
  }

  async getCrossCurrencyBasisMap() {
    const data = await CfdCrossCurrencyBasisData.find();
    return data.reduce((prev, o) => ({ ...prev, [o.expiry]: o }), {});
  }

  async getRecoveryMap() {
    const data = await CfdDefaultRecoveryUponData.find();
    return data.reduce((prev, o) => ({ ...prev, [o.serviceName]: o }), {});
  }

  async getRequiredMarginMap() {
    const initialData = await CfdRequiredInitialMarginData.find();
    const data = await CfdRequiredMarginData.find();
    const mapData = data.reduce((prev, o) => ({ ...prev, [o.serviceName]: o }), {});
    return initialData.reduce(
      (prev, o) => ({ ...prev, [o.serviceName]: { ...o, ...(mapData[o.serviceName] || {}) } }),
      {},
    );
  }

  async getScrapingData() {
    const data = await CfdScrapingData.find({ serviceName: this.adapterName });
    return data.reduce((prev, o) => ({ ...prev, [o.nomismaSymbol]: o }), {});
  }

  getScrapingInstrumentProperty(symbol, key) {
    const instrument = this.scrapingData[symbol];
    return instrument && instrument[key];
  }

  async getQuasiData() {
    const data = await CfdQuasiLiveData.find({ serviceName: this.adapterName });
    return data.reduce((prev, o) => ({ ...prev, [o.symbol]: o }), {});
  }

  async matchInstruments() {
    const apiInstruments = await this.getQuasiData();
    const scrapingInstuments = await this.getScrapingData();
    const countApiInstruments = Object.keys(apiInstruments).length;
    const countScrapingInstuments = Object.keys(scrapingInstuments).length;
    const allSymbols = _.union(Object.keys(apiInstruments), Object.keys(scrapingInstuments));
    const countAllInstruments = allSymbols.length;
    const result = {
      countApiInstruments,
      countScrapingInstuments,
      countAllInstruments,
      matched: 0,
      unmatched: 0,
    };
    // clean up CfdQuasiLiveData
    await CfdUnmatchedSymbolsData.deleteMany({ serviceName: this.adapterName });
    await CfdQuasiLiveData.updateMany(
      { serviceName: this.adapterName },
      { $unset: { matched: 1 } },
    );
    // merge process
    allSymbols.forEach(async (symbol) => {
      // matched
      if (scrapingInstuments[symbol] && apiInstruments[symbol]) {
        this.logDebug(`DCSD ${symbol} matched`);
        const instrument = scrapingInstuments[symbol];
        const scrapingData = _.pick(instrument, this.scrapingFields);
        await CfdQuasiLiveData.updateOne(
          { symbol, serviceName: this.adapterName },
          {
            $set: {
              ...scrapingData,
              symbolScraping: instrument.scrapingSymbol,
              matched: true,
            },
          },
          { upsert: true },
        );
        result.matched += 1;
      } else if (apiInstruments[symbol]) {
        // unmatched from api
        this.logDebug(`DCSD ${symbol} unmatched from api`);
        await this.persistUnmatchedInstrument({
          ...apiInstruments[symbol],
          from: 'api',
          symbol,
        });
        result.unmatched += 1;
      } else {
        // unmatched from scraping
        this.logDebug(`DCSD ${symbol} unmatched from scraping`);
        await this.persistUnmatchedInstrument({
          ...scrapingInstuments[symbol],
          from: 'scraping',
          symbol,
        });
        result.unmatched += 1;
      }
    });
    return result;
  }

  async persistUnmatchedInstrument(instrument) {
    const result = await CfdUnmatchedSymbolsData.updateOne(
      { symbol: instrument.symbol, serviceName: this.adapterName },
      {
        $set: {
          ..._.omit(instrument, '_id'),
          from: 'api',
        },
      },
      { upsert: true },
    );
    return result;
  }

  mapTickerToDoc(instrument) {
    return this.fields.reduce(
      (o, key) => ({ ...o, [key]: this[key] ? this[key](instrument) : '' }),
      {},
    );
  }

  expiry(instrument) {
    const contract = this.contract(instrument);
    const expiry = this.expiryDatesMap[contract]
      ? this.expiryDatesMap[contract].expiry
      : dateFormat(addDays(new Date(), defaultIntervalInDays), 'YYYY-MM-DD');
    return expiry;
  }

  fundingOffer(instrument) {
    const expiry = this.expiry(instrument);
    const marginCcy = this.marginCcy(instrument);
    const fundingOffer = (this.interestRatesFundingOfferMap[expiry]
        && this.interestRatesFundingOfferMap[expiry][marginCcy]) || 0;
    if (fundingOffer === 0) {
      return expiryInterpolation({ expiry, marginCcy, map: this.interestRatesFundingOfferMap });
    }
    return fundingOffer;
  }

  fundingOfferTailored(instrument) {
    const marginCcy = this.marginCcy(instrument);
    return (
      (this.fundingOfferTailoredMap[marginCcy]
        && this.fundingOfferTailoredMap[marginCcy].fundingOfferTailored)
      || 0
    );
  }

  crossCurrencyBasis(instrument) {
    const expiry = this.expiry(instrument);
    const marginCcy = this.marginCcy(instrument);
    const crossCurrencyBasis = (this.crossCurrencyBasisMap[expiry] && this.crossCurrencyBasisMap[expiry][marginCcy])
      || 0;
    if (crossCurrencyBasis === 0) {
      return expiryInterpolation({ expiry, marginCcy, map: this.crossCurrencyBasisMap });
    }
    return crossCurrencyBasis;
  }

  exposure() {
    return (this.cfdSettingsMap && this.cfdSettingsMap.exposure) || 0;
  }

  exposureTailored() {
    return (this.cfdSettingsMap && this.cfdSettingsMap.exposureTailored) || 0;
  }

  recovery() {
    return (this.recoveryMap[this.adapterName] && this.recoveryMap[this.adapterName].recovery) || 0;
  }

  requiredMargin() {
    return (
      (this.requiredMarginMap[this.adapterName]
        && this.requiredMarginMap[this.adapterName].requiredMargin)
      || 0
    );
  }

  logError(message) {
    this.logger.error({ message: `${this.adapterName} ${message}` });
  }

  logInfo(message) {
    this.logger.info({ message: `${this.adapterName} ${message}` });
  }

  logDebug(message) {
    this.logger.debug({ message: `${this.adapterName} ${message}` });
  }
}
