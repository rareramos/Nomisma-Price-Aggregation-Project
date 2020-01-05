
let environment = null;

export const setEnvironment = env => {
  environment = env;
};

export const getEnvironment = () => {
  if (!environment) {
    throw new Error('Environment not set');
  }
  return environment;
};
