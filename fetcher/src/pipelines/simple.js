import {
  fetch as dharmaFetch,
  process as dharmaProcess,
  clean as cleanDharmaDataTable,
} from '../adapters/dharma';
import {
  fetch as compoundFetch,
  process as compoundProcess,
  clean as cleanCompoundDataTable,
} from '../adapters/compound';
import {
  fetch as makerFetch,
  process as makerProcess,
  clean as cleanMakerDataTable,
} from '../adapters/maker';
import allAdaptersBlockTimestampRunner from '../adapters/timestamp';
import {
  merge as mergeProcess,
  clean as cleanLoanDataTable,
} from '../adapters/merge';
import { log } from '../utils/logger';

const simpleSequentialPipelineRunner = async () => {
  log.info({
    message: '********** Started fetching dharmaFetch **********',
  });

  await dharmaFetch();

  log.info({
    message: '********** Ended fetching dharmaFetch **********',
  });

  log.info({
    message: '********** Started fetching compoundFetch **********',
  });

  await compoundFetch();

  log.info({
    message: '********** Ended fetching compoundFetch **********',
  });

  log.info({
    message: '********** Started fetching makerFetch **********',
  });

  await makerFetch();

  log.info({
    message: '********** Ended fetching makerFetch **********',
  });

  log.info({
    message: '********** Started running allAdaptersBlockTimestampRunner **********',
  });

  await allAdaptersBlockTimestampRunner();

  log.info({
    message: '********** Ended running allAdaptersBlockTimestampRunner **********',
  });

  log.info({
    message: '********** Started processing dharmaProcess **********',
  });

  await dharmaProcess();

  log.info({
    message: '********** Ended processing dharmaProcess **********',
  });

  log.info({
    message: '********** Started processing compoundProcess **********',
  });

  await compoundProcess();

  log.info({
    message: '********** Ended processing compoundProcess **********',
  });

  log.info({
    message: '********** Started processing makerProcess **********',
  });

  await makerProcess();

  log.info({
    message: '********** Ended processing makerProcess **********',
  });

  log.info({
    message: '********** Started processing mergeProcess **********',
  });

  await mergeProcess();

  log.info({
    message: '********** Ended processing mergeProcess **********',
  });

  log.info({
    message: '********** Started cleaning cleanDharmaDataTable **********',
  });

  await cleanDharmaDataTable();

  log.info({
    message: '********** Ended cleaning cleanDharmaDataTable **********',
  });

  log.info({
    message: '********** Started cleaning cleanCompoundDataTable **********',
  });

  await cleanCompoundDataTable();

  log.info({
    message: '********** Ended cleaning cleanCompoundDataTable **********',
  });

  log.info({
    message: '********** Started cleaning cleanMakerDataTable **********',
  });

  await cleanMakerDataTable();

  log.info({
    message: '********** Ended cleaning cleanMakerDataTable **********',
  });

  log.info({
    message: '********** Started cleaning cleanLoanDataTable **********',
  });

  await cleanLoanDataTable();

  log.info({
    message: '********** Ended cleaning cleanLoanDataTable **********',
  });
};

export default simpleSequentialPipelineRunner;
