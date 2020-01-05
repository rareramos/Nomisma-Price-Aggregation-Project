import { IQausiLiveProperties, IQuasiLiveData, IQuasiInstruments } from '../types';

export const preprocessInstruments = (data : Array<IQausiLiveProperties>) : IQuasiLiveData | IQuasiInstruments => {
  /**
   * creates list of each currency-pair records based on symbol and serviceName
   * removes _id field before sending data
   */

  const toReturn : IQuasiLiveData | IQuasiInstruments = {};

  data.forEach((bit : IQausiLiveProperties) : void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...restObj } = bit;
    const symbol : string = bit.symbol || (bit.nomismaSymbol || '');
    const { serviceName } = bit;

    if (toReturn[symbol]) {
      if (toReturn[symbol][serviceName]) {
        toReturn[symbol][serviceName] = { ...toReturn[symbol][serviceName], ...restObj };
      } else {
        toReturn[symbol][serviceName] = restObj;
      }
    } else {
      toReturn[symbol] = { [serviceName]: restObj };
    }
  });

  return toReturn;
};
