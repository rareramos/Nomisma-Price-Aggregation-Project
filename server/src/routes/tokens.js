import express from 'express';
import { constants, getHardCodedCollection } from '@nomisma/nomisma-database';

const {
  getParseAllCurrencies,
} = getHardCodedCollection(constants.database.HARD_CODED_KYBER_NETWORK_COLNAME);

let allTokens = null;

const getCacheAllTokens = async () => {
  allTokens = await getParseAllCurrencies(true);
};

const router = express.Router();

router.get('/tokens', async (req, res) => {
  if (!allTokens) {
    await getCacheAllTokens();
  }
  res.send(allTokens);
});

export default router;
