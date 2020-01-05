
const simpleLog = (type, message) => {
  if (!process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`${new Date().toUTCString()}: ${type}: ${message}`);
  }
};

export const log = {
  error: (message) => simpleLog('ERROR', message),
  info: (message) => simpleLog('INFO', message),
};
