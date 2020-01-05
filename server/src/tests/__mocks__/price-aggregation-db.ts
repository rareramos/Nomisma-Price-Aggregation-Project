import { ICfdFindFilter } from '../../types';

let environment : object;
let logger : object;

export const setEnvironment = (env : object) : void => {
  environment = env;
};

export const getEnvironment = () : object => {
  if (!environment) {
    throw new Error('Environment not set');
  }
  return environment;
};

export const setLogger = (env : object) : void => {
  logger = env;
};

export const getLogger = () : object => {
  if (!logger) {
    throw new Error('Environment not set');
  }
  return logger;
};

export const CfdQuasiLiveData = {
  insertOne: (data : object) : Promise<object> => Promise.resolve(data),
  find: (filters : ICfdFindFilter) : Promise<Array<object>> => Promise.resolve([
    {
      _id: '5d3ecc1f5dd252f07b40b9f8',
      serviceName: 'Deribit',
      symbol: filters.symbol || 'USD-BTC',
      base: 'ETH',
      classification: 'Pair',
      contract: 'Dec19',
      fundingLong: 0,
      fundingShort: 0,
      makerFee: 0,
      margin: 0,
      marginCcy: 'ETH',
      name: 'ETH/USD',
      takerFee: 0,
      underlying: 'USD',
    },
  ]),
};

export const CfdExpiryDatesMappingData = {
  find: () : Promise<Array<object>> => Promise.resolve([]),
};
