import { constants, getHardCodedCollection } from '@nomisma/nomisma-database';

const {
  getParseAllCurrencies,
} = getHardCodedCollection(constants.database.HARD_CODED_KYBER_NETWORK_COLNAME);

let allTokens = null;

export const getCacheAllTokens = async () => {
  if (!allTokens) {
    const allTokensArr = await getParseAllCurrencies(true);
    allTokens = allTokensArr.reduce((acc, item) => ({
      ...acc,
      [item.address.toLowerCase()]: item,
    }),
    {});
  }
  return allTokens;
};
