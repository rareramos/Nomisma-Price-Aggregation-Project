import fetch from 'node-fetch';
import environment from '../../../environment';
import {
  fields, scrapingFields, currenciesMap, rulesPersistQuasiData,
} from './config.json';
import { AbstractAdapter } from '../abstract-adapter';

const { kraken: krakenConfig } = environment;

export class Kraken extends AbstractAdapter {
  constructor() {
    super('Kraken');

    // Set socket URL
    this.socketUrl = krakenConfig.KRAKEN_WSS;
    // Schema data
    this.fields = fields;
    // Rules persist data
    this.rulesPersistQuasiData = rulesPersistQuasiData;
    // Schema scraping data
    this.scrapingFields = scrapingFields;
  }

  async getInstruments() {
    const instruments = await fetch(krakenConfig.KRAKEN_INSTRUMENTS)
      .then(res => res.json())
      .then(({ tickers }) => tickers);
    return instruments.reduce((o, i) => {
      const { symbol } = i;
      return this.symbolsMap[symbol] ? { ...o, [symbol]: { ...i, symbol } } : o;
    }, {});
  }

  async subscribeInstruments(instruments = []) {
    if (instruments && instruments.length) {
      this.send({
        event: 'subscribe',
        feed: 'ticker',
        // eslint-disable-next-line @typescript-eslint/camelcase
        product_ids: instruments,
      });
    }
  }

  async unsubscribeInstruments(instruments = []) {
    if (instruments && instruments.length) {
      this.send({
        event: 'unsubscribe',
        feed: 'ticker',
        // eslint-disable-next-line @typescript-eslint/camelcase
        product_ids: instruments,
      });
    }
  }

  async tick({ event }) {
    if (event.feed === 'heartbeat') {
      this.logDebug('ping');
    } else if (event.feed === 'ticker' && event.event === 'subscribed') {
      this.logDebug(`subscribed ${event.product_ids.join(' ')}`);
    } else if (event.feed === 'ticker') {
      const data = { ...event, symbol: String(event.product_id).toLowerCase() };
      this.handleTickData(data);
    }
  }

  startHeartbeat() {
    this.logDebug('start heartbeat');
    this.send({
      event: 'subscribe',
      feed: 'heartbeat',
    });
  }

  name(instrument) {
    return this.symbolsMap[instrument.symbol].name;
  }

  contract(instrument) {
    return this.symbolsMap[instrument.symbol].contract;
  }

  symbol(instrument) {
    return this.symbolsMap[instrument.symbol].symbol;
  }

  serviceSymbol(instrument) {
    return instrument.symbol;
  }

  classification(instrument) {
    return this.symbolsMap[instrument.symbol].classification;
  }

  base(instrument) {
    return this.currency(instrument.pair && instrument.pair.split(':')[0]);
  }

  underlying(instrument) {
    return this.currency(instrument.pair && instrument.pair.split(':')[1]);
  }

  serviceName() {
    return this.adapterName;
  }

  bid(instrument) {
    return instrument.bid;
  }

  offer(instrument) {
    return instrument.ask;
  }

  fundingLong(instrument) {
    const fundingRate = instrument.funding_rate || instrument.fundingRate || 0;
    return fundingRate * -2400;
  }

  fundingShort(instrument) {
    const fundingRate = instrument.funding_rate || instrument.fundingRate || 0;
    return fundingRate * 2400;
  }

  makerFee(instrument) {
    const symbol = this.symbol(instrument);
    return parseFloat(this.getScrapingInstrumentProperty(symbol, 'makerFee') || 0).toFixed(8) * 1;
  }

  takerFee(instrument) {
    const symbol = this.symbol(instrument);
    return parseFloat(this.getScrapingInstrumentProperty(symbol, 'takerFee') || 0).toFixed(8) * 1;
  }

  margin(instrument) {
    const symbol = this.symbol(instrument);
    return parseFloat(this.getScrapingInstrumentProperty(symbol, 'margin') || 0).toFixed(2) * 1;
  }

  marginCcy(instrument) {
    const symbol = this.symbol(instrument);
    return this.getScrapingInstrumentProperty(symbol, 'marginCcy') || instrument.base_currency;
  }

  currency(cur) {
    return currenciesMap[cur] || cur;
  }
}
