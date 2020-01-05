import { getDummyLiveTickData, getCfdScrapingData } from '../adapters/bitmex/__tests__/mock-utils/data-objects';
import { ICfdScrapingData } from '../types/adapters/bitmex';

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
    throw new Error('Logger not set for Environment');
  }
  return logger;
};

export const CfdMappingSymbolsData = {
  find: ({ serviceName } : { serviceName : string }) : Promise<Array<object>> => {
    const [data] = Object.create(getDummyLiveTickData());
    if (serviceName === 'deribit.com') {
      data.name = serviceName;
    }
    return Promise.resolve([data]);
  },
};

export const CfdQuasiLiveData = {
  find: ({ serviceName } : { serviceName : string }) : Promise<Array<object>> => {
    const [data] = Object.create(getDummyLiveTickData());
    if (serviceName === 'deribit.com') {
      data.name = serviceName;
    }
    return Promise.resolve([data]);
  },
  updateOne: () : Promise<void> => Promise.resolve(),
};

export const CfdScrapingData = {
  find: () : Promise<Array<ICfdScrapingData>> => Promise.resolve([getCfdScrapingData()]),
};

export const CfdExpiryDatesMappingData = {
  find: () : Promise<Array<string>> => Promise.resolve([]),
};

export const CfdInterestRatesFundingOfferData = {
  find: () : Promise<Array<string>> => Promise.resolve([]),
};

export const CfdUnmatchedSymbolsData = {
  deleteMany: () : Promise<void> => Promise.resolve(),
  updateOne: () : Promise<void> => Promise.resolve(),
};
