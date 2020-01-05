import environmentSecrets from 'environment-secrets';

const {
  generateSecretsOrExtWithDefault,
  wrapWithPropNames,
} = environmentSecrets;

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
  app: wrapWithPropNames({
    PORT: secretsOrExtWithDefault('8000'),
    ENV: secretsOrExtWithDefault('development'),
  }),
  database: wrapWithPropNames({
    MONGODB_URI: secretsOrExtWithDefault('mongodb://127.0.0.1:27017/nomisma'),
    DB_PATH: secretsOrExtWithDefault('nomisma-price-aggr'),
    CONFIG_PATH: secretsOrExtWithDefault(''),
    DEFAULT_LOG_LEVEL: secretsOrExtWithDefault(2),
  }),
  cron: wrapWithPropNames({
    CRON_DAILY_REPORT_INSTRUMENTS: secretsOrExtWithDefault('5 8 * * *'),
  }),
};
const app = wrapWithPropNames(props);
export { app };
