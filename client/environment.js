const environmentSecrets = require('environment-secrets');

const {
  generateSecretsOrExtWithDefault,
  wrapWithPropNames,
} = environmentSecrets;

let extConfig;
try {
  // eslint-disable-next-line import/no-unresolved
  extConfig = require('./secrets'); // import secrets.js if available
} catch (err) {
  extConfig = {};
}

const secretsOrExtWithDefault = generateSecretsOrExtWithDefault(
  extConfig,
);

const props = {
  app: wrapWithPropNames({
    API_URI: secretsOrExtWithDefault('http://localhost:8000'),
    CFD_API_URL: secretsOrExtWithDefault('ws://localhost:38496'),
    NODE_ENV: secretsOrExtWithDefault('development'),
    LOANS_API_ENDPOINT: secretsOrExtWithDefault('https://api.loanscan.io/api/v0/Issuances'),
    USE_OWN_API: secretsOrExtWithDefault(false),
    DEFAULT_LOG_LEVEL: secretsOrExtWithDefault(2),
  }),
  database: wrapWithPropNames({
    MONGODB_URI: secretsOrExtWithDefault('mongodb://127.0.0.1:27017/nomisma'),
    DB_PATH: secretsOrExtWithDefault('nomisma-price-aggr'),
  }),
};

module.exports = wrapWithPropNames(props);
