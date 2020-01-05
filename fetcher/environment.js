/* eslint-disable @typescript-eslint/no-var-requires */
const { generateSecretsOrExtWithDefault, wrapWithPropNames } = require('environment-secrets');

let extConfig;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  extConfig = require('./secrets'); // import secrets.js if available
} catch (err) {
  extConfig = {};
}

const secretsOrExtWithDefault = generateSecretsOrExtWithDefault(
  extConfig,
);

const props = {
  blockchain: wrapWithPropNames({
    PROVIDER_URL: secretsOrExtWithDefault('https://mainnet.infura.io'),
    COMPOUND_ADDRESS: secretsOrExtWithDefault('0x3FDA67f7583380E67ef93072294a7fAc882FD7E7'),
    BALANCES_UPDATE_BLOCK_INTERVAL: secretsOrExtWithDefault('500'),
    DHARMA_DEBT_KERNEL_ADDRESS: secretsOrExtWithDefault('0x8ef1351941d0CD8da09d5A4c74f2d64503031A18'),
    DHARMA_COLLATERALISED_TERMS_ADDRESS: secretsOrExtWithDefault('0x5de2538838b4eb7fa2dbdea09d642b88546e5f20'),
    DHARMA_LTV_CREDITOR_PROXY_ADDRESS: secretsOrExtWithDefault('0xa9D37Fd3Dc36418E806dbbc16FE991C284940858'),
    DHARMA_DEBT_REGISTRY_ADDRESS: secretsOrExtWithDefault('0x4e0f2b97307ad60b741f993c052733acc1ea5811'),
    DHARMA_COLLATERALISER_ADDRESS: secretsOrExtWithDefault('0xecc718386176d714dc9e4e35e177396b291499ee'),
    DHARMA_REPAYMENT_ROUTER_ADDRESS: secretsOrExtWithDefault('0xc1df9b92645cc3b6733992c692a39c34a86fae5f'),
    MAKER_SAI_TUB_ADDRESS: secretsOrExtWithDefault('0x448a5065aebb8e423f0896e6c5d525c040f59af3'),
    MAKER_TOKEN_CONTRACT_ADDRESS: secretsOrExtWithDefault('0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'),
    MAKER_PIT_CONTRACT_ADDRESS: secretsOrExtWithDefault('0x69076e44a9c70a67d5b79d95795aba299083c275'),
  }),
  bitmex: wrapWithPropNames({
    BITMEX_INSTRUMENTS:
    secretsOrExtWithDefault('https://www.bitmex.com/api/v1/instrument?filter=%7B%22state%22%3A%20%22Open%22%7D'),
    BITMEX_BASE_URL: secretsOrExtWithDefault('https://www.bitmex.com/api/v1/'),
    BITMEX_WS_URL: secretsOrExtWithDefault('wss://www.bitmex.com/realtime'),
  }),
  ig: wrapWithPropNames({
    IG_KEY: secretsOrExtWithDefault(''),
    IG_IDENTIFIER: secretsOrExtWithDefault(''),
    IG_PASSWORRD: secretsOrExtWithDefault(''),
    IG_TEST_SERVER: secretsOrExtWithDefault(true),
  }),
  deribit: wrapWithPropNames({
    DERIBIT_WS_URL: secretsOrExtWithDefault('wss://www.deribit.com/ws/api/v2'),
    DERIBIT_BASE_URL: secretsOrExtWithDefault('https://www.deribit.com/api/v2'),
  }),
  fxcm: wrapWithPropNames({
    FXCM_TOKEN: secretsOrExtWithDefault(''),
  }),
  kraken: wrapWithPropNames({
    KRAKEN_INSTRUMENTS: secretsOrExtWithDefault('https://futures.kraken.com/derivatives/api/v3/tickers'),
    KRAKEN_WSS: secretsOrExtWithDefault('wss://futures.kraken.com/ws/v1'),
  }),
  publisher: wrapWithPropNames({
    ENDPOINT: secretsOrExtWithDefault('ws://localhost:38495'),
  }),
  thirdParty: wrapWithPropNames({
    COINMARKETCAP_API_URL: secretsOrExtWithDefault('https://pro-api.coinmarketcap.com/v1'),
    COINMARKETCAP_API_KEY: secretsOrExtWithDefault('41207459-93eb-4b6e-8e16-3bf522ee4330'),
  }),
  app: wrapWithPropNames({
    EVENT_HANDLER_TIMEOUT: secretsOrExtWithDefault(10000),
    ENV: secretsOrExtWithDefault('development'),
    ARR_CHUNK_SIZE: secretsOrExtWithDefault('50'),
    BATCH_TIMESTAMP_ARR_CHUNK_SIZE: secretsOrExtWithDefault('1500'),
    DEFAULT_LOG_LEVEL: secretsOrExtWithDefault(2),
  }),
  database: wrapWithPropNames({
    MONGODB_URI: secretsOrExtWithDefault('mongodb://127.0.0.1:27017/nomisma'),
    DB_PATH: secretsOrExtWithDefault('nomisma-price-aggr'),
    CONFIG_PATH: secretsOrExtWithDefault(''),
  }),
  cron: wrapWithPropNames({
    CRON_DAILY_MATCH_INSTRUMENTS: secretsOrExtWithDefault('0 8 * * *'),
    CRON_DAILY_CHECK_INSTRUMENTS: secretsOrExtWithDefault('30 7 * * *'),
  }),
};
module.exports = wrapWithPropNames(props);
