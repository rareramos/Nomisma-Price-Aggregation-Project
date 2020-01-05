import { Request, Response, Router } from 'express';
import { constants, getHardCodedCollection } from '@nomisma/nomisma-database';

import { ITokens } from '../types';

const {
  getParseAllCurrencies,
} = getHardCodedCollection(constants.database.HARD_CODED_KYBER_NETWORK_COLNAME);

let allTokens : Array<ITokens> | null;

const getCacheAllTokens = async () : Promise<void> => {
  allTokens = await getParseAllCurrencies(true);
};

const router = Router();

router.get('/tokens', async (_req : Request, res : Response) : Promise<void> => {
  if (!allTokens) {
    await getCacheAllTokens();
  }
  res.send(allTokens);
});

export default router;
