import IG from 'ig-markets';
import ls from 'lightstreamer-client';
import environment from '../../../environment';
import {
  fields, scrapingFields, fieldNamesMap, nodes, rulesPersistQuasiData,
} from './config.json';
import { AbstractAdapter } from '../abstract-adapter';

const { ig: igConfig } = environment;

export class IgIndex extends AbstractAdapter {
  constructor() {
    super('IG');

    // Schema data
    this.fields = fields;
    // Rules persist data
    this.rulesPersistQuasiData = rulesPersistQuasiData;
    // Schema scraping data
    this.scrapingFields = scrapingFields;

    this.ig = new IG(
      igConfig.IG_KEY,
      igConfig.IG_IDENTIFIER,
      igConfig.IG_PASSWORRD,
      igConfig.IG_TEST_SERVER,
    );
    this.loginData = null;
    this.lsClient = null;
    this.subscription = null;
  }

  getInstruments() {
    const instruments = [];
    nodes.forEach(async (node) => {
      /* eslint-disable-next-line no-await-in-loop, no-underscore-dangle */
      const { markets: data } = await this.ig._request(
        'get',
        `marketnavigation/${node.id}`,
        null,
        1,
      );
      data.forEach(async (instrument) => {
        if (instrument.epic.includes('CFD')) {
          /* eslint-disable-next-line no-await-in-loop, no-underscore-dangle */
          const market = await this.ig._request('get', `markets/${instrument.epic}`, null, 3);
          instruments.push({ ...market.instrument, ...market.dealingRules, ...market.snapshot });
        }
      });
    });
    return instruments.reduce((o, i) => ({ ...o, [i.epic]: i }), {});
  }

  async subscribeInstruments() {
    const instruments = Object.keys(this.adapterInstruments);
    if (instruments && instruments.length) {
      this.subscription = this.setupSubscription(instruments);
      this.lsClient.subscribe(this.subscription);
    }
  }

  async unsubscribeInstruments() {
    if (this.subscription) {
      this.lsClient.unsubscribe(this.subscription);
    }
  }

  async subscribe() {
    // Login
    this.loginData = await this.login();
    // Calls super subscribe
    await super.subscribe();
    // Starts subscription
    this.subscribeInstruments();
  }

  connect() {
    if (this.loginData) {
      this.lsClient = this.setupLightstreamer(this.loginData);
    }
  }

  async login() {
    const { lightstreamerEndpoint, currentAccountId } = await this.ig.login();
    const lightstreamerPwd = `CST-${this.ig.cst}|XST-${this.ig.token}`;
    return {
      lightstreamerEndpoint,
      currentAccountId,
      lightstreamerPwd,
    };
  }

  async tick({ event }) {
    const { item } = event;
    const [, epic] = String(item.getItemName()).split(':', 2);
    const data = { symbol: epic };
    item.forEachField((fieldName, fieldPos, value) => {
      data[fieldNamesMap[fieldName]] = parseFloat(value);
    });
    this.handleTickData(data);
  }

  setupLightstreamer({ lightstreamerEndpoint, currentAccountId, lightstreamerPwd }) {
    const lsClient = new ls.LightstreamerClient(lightstreamerEndpoint);
    lsClient.connectionDetails.setUser(currentAccountId);
    lsClient.connectionDetails.setPassword(lightstreamerPwd);
    lsClient.addListener({
      onListenStart() {
        this.logDebug('Started listening');
      },
      onStatusChange(status) {
        this.logDebug(`Lightstreamer connection status:${status}`);
      },
    });
    lsClient.connect();
    return lsClient;
  }

  setupSubscription(instruments = []) {
    const topics = instruments.map(symbol => `MARKET:${symbol}`);
    const subscription = new ls.Subscription('MERGE', topics, ['BID', 'OFFER']);
    subscription.addListener({
      onSubscription: () => {
        this.logDebug(`subscribe ${topics.join(' ')}`);
      },
      onUnsubscription: () => {
        this.logDebug('unsubscribe');
      },
      onItemUpdate: item => this.tick({ event: { item } }),
    });
    return subscription;
  }

  name(instrument) {
    return this.symbolsMap[instrument.epic].name;
  }

  contract(instrument) {
    return this.symbolsMap[instrument.epic].contract;
  }

  symbol(instrument) {
    return this.symbolsMap[instrument.epic].symbol;
  }

  serviceSymbol(instrument) {
    return instrument.epic;
  }

  classification(instrument) {
    return this.symbolsMap[instrument.epic].classification;
  }

  base(instrument) {
    return this.symbolsMap[instrument.epic].base;
  }

  underlying(instrument) {
    return this.symbolsMap[instrument.epic].underlying;
  }

  serviceName() {
    return this.adapterName;
  }

  bid(instrument) {
    return instrument.bid;
  }

  offer(instrument) {
    return instrument.offer;
  }

  fundingLong(instrument) {
    const info = instrument.specialInfo.find(s => s.includes('Daily funding 7 days a week'));
    const a = info.split(/[-,]/).map(v => v.trim());
    return -1 * parseFloat(a[1].replace(/[^\d.]+/gi, ''));
  }

  fundingShort(instrument) {
    const info = instrument.specialInfo.find(s => s.includes('Daily funding 7 days a week'));
    const a = info.split(/[-,]/).map(v => v.trim());
    return String(a[2]).includes('receive')
      ? parseFloat(a[2].replace(/[^\d.]+/gi, ''))
      : -1 * parseFloat(a[2].replace(/[^\d.]+/gi, ''));
  }

  margin(instrument) {
    return instrument.marginFactor;
  }

  marginCcy() {
    return 'USD';
  }

  guaranteedStop() {
    return true;
  }

  guaranteedStopPremium(instrument) {
    return parseFloat(instrument.limitedRiskPremium.value) * parseFloat(instrument.valueOfOnePip);
  }
}
