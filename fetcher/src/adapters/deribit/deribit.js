import fetch from 'node-fetch';
import querystring from 'querystring';
import environment from '../../../environment';
import { fields, scrapingFields, rulesPersistQuasiData } from './config.json';
import { AbstractAdapter } from '../abstract-adapter';

const { deribit: deribitConfig } = environment;

export class Deribit extends AbstractAdapter {
  constructor() {
    super('Deribit');

    // Set socket URL
    this.socketUrl = deribitConfig.DERIBIT_WS_URL;
    // Schema data
    this.fields = fields;
    // Rules persist data
    this.rulesPersistQuasiData = rulesPersistQuasiData;
    // Schema scraping data
    this.scrapingFields = scrapingFields;
  }

  async getInstruments() {
    let instruments = {};
    const currencySymbols = ['BTC', 'ETH'];
    currencySymbols.forEach(async (currency) => {
      const query = querystring.stringify({
        currency,
        kind: 'future',
      });
      // eslint-disable-next-line no-await-in-loop
      const { result } = await fetch(
        `${deribitConfig.DERIBIT_BASE_URL}/public/get_book_summary_by_currency?${query}`,
      ).then(res => res.json());
      instruments = {
        ...instruments,
        ...result.reduce(
          (o, inst) => (this.symbolsMap[inst.instrument_name] ? { ...o, [inst.instrument_name]: inst } : o),
          this.adapterInstruments,
        ),
      };
    });
    return instruments;
  }

  async subscribeInstruments(instruments = []) {
    if (instruments && instruments.length) {
      this.send({
        id: 1000,
        method: 'public/subscribe',
        params: {
          channels: instruments.map(symbol => `ticker.${symbol}.100ms`),
        },
      });
    }
  }

  async unsubscribeInstruments(instruments = []) {
    if (instruments && instruments.length) {
      this.send({
        id: 2000,
        method: 'public/unsubscribe',
        params: {
          channels: instruments.map(symbol => `ticker.${symbol}.100ms`),
        },
      });
    }
  }

  async tick({ event }) {
    if (event.params && event.params.type === 'test_request') {
      this.logDebug('ping');
      this.pong();
    } else if (event.method === 'subscription') {
      const {
        params: { data: ticker },
      } = event;
      const data = { ...ticker, symbol: ticker.instrument_name };
      this.handleTickData(data);
    } else if (event.id === 1000) {
      this.logDebug(`subscribed ${event.result.map(v => v.split('.')[1]).join(' ')}`);
    } else if (event.id === 2000) {
      this.logDebug(`unsubscribed ${event.result.map(v => v.split('.')[1]).join(' ')}`);
    }
  }

  startHeartbeat() {
    this.logDebug('start heartbeat');
    this.send({
      method: 'public/set_heartbeat',
      params: {
        interval: 30,
      },
    });
  }

  pong() {
    this.logDebug('pong');
    this.send({ method: 'public/test' });
  }

  send({ method, id = 1, params = {} }) {
    super.send({
      jsonrpc: '2.0', id, method, params,
    });
  }

  symbol(instrument) {
    return this.symbolsMap[instrument.instrument_name].symbol;
  }

  serviceSymbol(instrument) {
    return instrument.instrument_name;
  }

  name(instrument) {
    return this.symbolsMap[instrument.instrument_name].name;
  }

  contract(instrument) {
    return this.symbolsMap[instrument.instrument_name].contract;
  }

  classification(instrument) {
    return this.symbolsMap[instrument.instrument_name].classification;
  }

  base(instrument) {
    return instrument.base_currency;
  }

  underlying(instrument) {
    return instrument.quote_currency;
  }

  serviceName() {
    return this.adapterName;
  }

  bid(instrument) {
    return instrument.best_bid_price || instrument.bid_price;
  }

  offer(instrument) {
    return instrument.best_ask_price || instrument.ask_price;
  }

  fundingLong(instrument) {
    return parseFloat((instrument.funding_8h || 0) * -300).toFixed(8) * 1;
  }

  fundingShort(instrument) {
    return parseFloat((instrument.funding_8h || 0) * 300).toFixed(8) * 1;
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
}
