import fetch from 'node-fetch';
import environment from '../../../environment';
import {
  fields, scrapingFields, currenciesMap, rulesPersistQuasiData,
} from './config.json';
import { AbstractAdapter } from '../abstract-adapter';

const { bitmex: bitmexConfig } = environment;

export class Bitmex extends AbstractAdapter {
  constructor() {
    super('Bitmex');

    // Set socket URL
    this.socketUrl = bitmexConfig.BITMEX_WS_URL;
    // Schema data
    this.fields = fields;
    // Rules persist data
    this.rulesPersistQuasiData = rulesPersistQuasiData;
    // Schema scraping data
    this.scrapingFields = scrapingFields;
  }

  async getInstruments() {
    const instruments = await fetch(`${bitmexConfig.BITMEX_BASE_URL}instrument/active`).then(res => res.json());
    return instruments.reduce(
      // ignore XBT7D* instrument
      (o, i) => (this.symbolsMap[i.symbol] ? { ...o, [i.symbol]: i } : o),
      {},
    );
  }

  async subscribeInstruments(instruments = []) {
    if (instruments && instruments.length) {
      instruments.forEach((sy) => {
        this.send({
          op: 'subscribe',
          args: `instrument:${sy}`,
        });
      });
    }
  }

  async unsubscribeInstruments(instruments = []) {
    if (instruments && instruments.length) {
      instruments.forEach((sy) => {
        this.send({
          op: 'unsubscribe',
          args: `instrument:${sy}`,
        });
      });
    }
  }

  async tick({ event }) {
    if (event.info) {
      this.logDebug(`${event.info} limit.remaining=${event.limit.remaining}`);
    } else if (event.success && event.subscribe) {
      this.logDebug(`subscribed ${event.subscribe}`);
    } else if (event.success && event.unsubscribe) {
      this.logDebug(`unsubscribed ${event.unsubscribe}`);
    } else if (event.error) {
      this.logError(event.error);
    } else if (event.table === 'instrument') {
      if (event.action === 'partial' || event.action === 'update') {
        const [data] = event.data;
        this.handleTickData(data);
      } else if (event.action === 'delete') {
        this.logError('Unhandle delte event action');
      }
    } else {
      this.logError('Unhandle event');
    }
  }

  ping() {
    this.logDebug('ping');
    this.send('ping');
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
    return this.currency(instrument.rootSymbol);
  }

  underlying(instrument) {
    return this.currency(instrument.quoteCurrency);
  }

  serviceName() {
    return this.adapterName;
  }

  bid(instrument) {
    return instrument.bidPrice;
  }

  offer(instrument) {
    return instrument.askPrice;
  }

  makerFee(instrument) {
    return instrument.makerFee * -100;
  }

  takerFee(instrument) {
    return instrument.takerFee * -100;
  }

  fundingLong(instrument) {
    return instrument.fundingRate * -300;
  }

  fundingShort(instrument) {
    return instrument.fundingRate * 300;
  }

  margin(instrument) {
    return instrument.initMargin * 100;
  }

  marginCcy(instrument) {
    return this.currency(String(instrument.settlCurrency).toUpperCase());
  }

  currency(cur) {
    return currenciesMap[cur] || cur;
  }
}
