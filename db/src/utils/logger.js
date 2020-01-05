
let logger = null;

export const setLogger = env => {
  logger = env;
};

export const getLogger = () => {
  if (!logger) {
    throw new Error('Environment not set');
  }
  return logger;
};
