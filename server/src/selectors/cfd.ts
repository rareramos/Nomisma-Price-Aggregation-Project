import { CfdExpiryDatesMappingData } from 'price-aggregation-db';
import { format, addDays, parseISO } from 'date-fns';

import {
  IQausiLiveProperties, IQuasiLiveData, IExpiryDatesMapping, IExpiryDatesMappingProperties,
} from '../types';

const defaultIntervalInDays = 10;

export const preprocessQuasiPrices = async (data : Array<IQausiLiveProperties>,
  params : { intervalDays : number } = { intervalDays: defaultIntervalInDays }) : Promise<IQuasiLiveData> => {
  const expiryDatesMappingData = await CfdExpiryDatesMappingData.find();
  const expiryDatesMap = expiryDatesMappingData.reduce(
    (prev : IExpiryDatesMapping, o : IExpiryDatesMappingProperties) : IExpiryDatesMapping => ({
      ...prev, [o.contract]: o,
    }),
    {},
  );
  const { intervalDays } = params;
  /**
   * creates list of each currency-pair records based on symbol and serviceName
   * removes _id field before sending data
   */
  const toReturn : IQuasiLiveData = {};

  data.forEach((bit : IQausiLiveProperties) : void => {
    // eslint-disable-next-line no-unused-vars
    const { ...restObj } = bit;
    const { symbol } = bit;
    const { serviceName } = bit;
    const { contract } = bit;
    restObj.expiry = expiryDatesMap[contract]
      ? format(parseISO(expiryDatesMap[contract].expiry), 'M/dd/yyyy')
      : format(addDays(new Date(), intervalDays), 'M/dd/yyyy');

    if (toReturn[symbol]) {
      if (toReturn[symbol][serviceName]) {
        toReturn[symbol][serviceName] = [...toReturn[symbol][serviceName], restObj];
      } else {
        toReturn[symbol][serviceName] = [restObj];
      }
    } else {
      toReturn[symbol] = { [serviceName]: [restObj] };
    }
  });

  return toReturn;
};
