const environmentSecrets = require('environment-secrets');

const {
  generateSecretsOrExtWithDefault,
  wrapWithPropNames,
} = environmentSecrets;

let extConfig;
try {
  extConfig = require('./secrets'); // import secrets.js if available
} catch (err) {
  extConfig = {};
}

const secretsOrExtWithDefault = generateSecretsOrExtWithDefault(
  extConfig
);

const props = {
  app: wrapWithPropNames({
    PORT: secretsOrExtWithDefault('8000'),
    ENV: secretsOrExtWithDefault('development'),
  }),
  database: wrapWithPropNames({
    MONGODB_URI: secretsOrExtWithDefault('mongodb://127.0.0.1:27017/nomisma'),
    DB_PATH: secretsOrExtWithDefault('nomisma-price-aggr'),
  }),
};

module.exports = wrapWithPropNames(props);
