import { CfdQuasiLiveData, CfdScrapingData, CfdUnmatchedSymbolsData } from 'price-aggregation-db';

import { preprocessInstruments } from '../selectors/instruments';
import { IQuasiFilter, IQuasiLiveData } from '../types';

export const getInstruments = async (filters : IQuasiFilter) : Promise<IQuasiLiveData | {}> => {
  const data = await CfdQuasiLiveData.find(filters);
  return preprocessInstruments(data);
};

export const getScrapingInstruments = async (filters : IQuasiLiveData) : Promise<IQuasiLiveData | {}> => {
  const data = await CfdScrapingData.find(filters);
  return preprocessInstruments(data);
};

export const getUnmatchedInstruments = async (filters : IQuasiLiveData) : Promise<IQuasiLiveData | {}> => {
  const data = await CfdUnmatchedSymbolsData.find(filters);
  return preprocessInstruments(data);
};
