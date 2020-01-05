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
} from '../adapters/maker';
import allAdaptersBlockTimestampRunner from '../adapters/timestamp';
import {
  merge as mergeProcess,
} from '../adapters/merge';

const simpleSequentialPipelineRunner = async () => {
  await dharmaFetch();
  await compoundFetch();
  await makerFetch();
  await allAdaptersBlockTimestampRunner();
  await dharmaProcess();
  await compoundProcess();
  await makerProcess();
  await mergeProcess();
  await cleanDharmaDataTable();
  await cleanCompoundDataTable();
};

export default simpleSequentialPipelineRunner;
