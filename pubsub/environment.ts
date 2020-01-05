import * as environmentSecrets from 'environment-secrets';

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
  RECEIVE_PORT: secretsOrExtWithDefault('38495'),
  SEND_PORT: secretsOrExtWithDefault('38496'),
  DEFAULT_LOG_LEVEL: secretsOrExtWithDefault(2),
};

export default wrapWithPropNames(props);
