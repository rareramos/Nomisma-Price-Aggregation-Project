import { CfdQuasiLiveData } from 'price-aggregation-db';

import { preprocessQuasiPrices } from '../../selectors/cfd';
import { IQuasiFilter, IQuasiLiveData } from '../../types';

export const getQuasiLiveData = async (filters : IQuasiFilter) : Promise<IQuasiLiveData> => {
  const data = await CfdQuasiLiveData.find(filters);
  const result = await preprocessQuasiPrices(data);
  return result;
};
