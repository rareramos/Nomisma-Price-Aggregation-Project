import { ILoanSelector } from '../types';
/**
 * Fills all boundaries against which no record exist
 * in the mongodb result-set and fills them with empty
 * objects
 * @param data
 * @param boundaries
 */
export const selectLoanBinsWithEmptyRecords = (data : ILoanSelector, boundaries : Array<number>) :
Array<ILoanSelector> => {
  const processedData = [{ ...data }];
  if (boundaries.length !== data.length) {
    boundaries.forEach((boundary : number) : void => {
      const instanceExist = processedData.findIndex(instance => instance._id === boundary) > -1;
      if (!instanceExist) {
        processedData.push({
          _id: boundary,
          count: 0,
          amounts: [],
        });
      }
    });
  }
  return processedData;
};
