
const simpleLog = (type, message) => {
  // eslint-disable-next-line no-console
  console.log(`${new Date().toLocaleString()}: ${type}: ${message}`);
};

export const log = {
  error: (message) => simpleLog('ERROR', message),
  info: (message) => simpleLog('INFO', message),
};
