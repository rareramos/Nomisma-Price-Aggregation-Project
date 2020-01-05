import { log } from '../../../utils/logger';
import {
  buildCollateralizationHash,
  chunkGetCups,
  combineDrawLockAndBalanceWithWipe,
  getCupsCount,
  mapCupsToDrawsHash,
  mapCupsToLockHash,
  mapCupsToOutstandingBalances,
  mapHashToOutstandingInterestFees,
} from './prepare';
import {
  fullHashToTable,
  updateCurrentLastBlock,
} from './calculate';
import { getToBlock } from '../../timestamp/common';

const chunkSize = 1000;

const runMaker = async () => {
  log.info({
    message: 'Staring maker processing',
  });

  const cupsCount = await getCupsCount();

  log.debug({
    message: `Cups count ${cupsCount}`,
  });

  let chunks = Math.floor(cupsCount / chunkSize);
  if (chunks * chunkSize < cupsCount) {
    chunks += 1;
  }
  const lastBlock = await getToBlock();
  const offsetArr = new Array(chunks).fill(0);
  const offsets = offsetArr.map((_, idx) => idx * chunkSize);
  await offsets.reduce(
    async (
      acc,
      offset,
    ) => {
      await acc;
      let toReturn;

      log.debug({
        message: `Processing cups with offset ${offset} and chunk size ${chunkSize}`,
      });

      const cups = await chunkGetCups(offset, chunkSize);

      log.debug({
        message: `Got ${cups.length} cups to process, starting,`,
      });

      const cupsToDrawsHash = await mapCupsToDrawsHash(cups);
      if (Object.keys(cupsToDrawsHash).length) {
        const cupsToLocksHash = await mapCupsToLockHash(cups);
        const collateralisationHash = buildCollateralizationHash({
          cups,
          cupsToDrawsHash,
          cupsToLocksHash,
        });
        const cupsOutstandingBalances = await mapCupsToOutstandingBalances(cups);
        const fullHash = await combineDrawLockAndBalanceWithWipe({
          collateralisationHash,
          cupsOutstandingBalances,
        });
        const withOutstandingFeesHash = await mapHashToOutstandingInterestFees(fullHash);
        toReturn = fullHashToTable(
          withOutstandingFeesHash,
          lastBlock,
        );
      } else {
        log.debug({
          message: 'No draws for this cups chunk',
        });

        toReturn = null;
      }
      return toReturn;
    },
    Promise.resolve(),
  );
  await updateCurrentLastBlock(lastBlock);
};

export default runMaker;
