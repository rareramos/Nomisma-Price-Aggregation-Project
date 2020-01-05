import { log } from '../../utils/logger';
import { getWeb3 } from '../generic';
import { chunkArr } from '../../utils/chunk-arr';
import {
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
  BlockTimestamp,
} from 'price-aggregation-db';
import { compoundEventNamesToColumnNamesMap } from '../compound/config';
import environment from '../../../environment';
import { dharmaEventNamesToColumnNamesMapDebtKernel } from '../dharma/config';
import { GetBlockByNumberMethod } from 'web3-core-method';
import * as Utils from 'web3-utils';
import { formatters } from 'web3-core-helpers';
import { makerSigsModelConfig } from '../maker/config';

const { app } = environment;

const chunkSize = parseInt(app.BATCH_TIMESTAMP_ARR_CHUNK_SIZE, 10);

const blockNumbersToMethods = blockNumbers => blockNumbers.map(blockNumber => {
  const method = new GetBlockByNumberMethod(Utils, formatters, {});
  method.setArguments([blockNumber, false]);
  method.callback = () => {};
  return method;
});

export const chunkedEventsReducerFactory = async (
  acc,
  events
) => {
  await acc;
  const blockTimestamps = events
    .map(
      (
        {
          blockNumber,
        }
      ) => blockNumber
    );
  const existingBlockDetails = await BlockTimestamp.find(
    {
      blockNumber: {
        $in: blockTimestamps,
      },
    }
  );
  let withoutTimestampEvents;
  if (!!existingBlockDetails.length) {
    const blockDetailsHash = existingBlockDetails.reduce(
      (
        fullBlockDetails,
        detail
      ) => ({
        ...fullBlockDetails,
        [detail.blockNumber]: detail.timestamp,
      }),
      {}
    );
    withoutTimestampEvents = [];
    events.forEach(evt => {
      if (!blockDetailsHash[evt.blockNumber]) {
        withoutTimestampEvents.push(evt);
      }
    });
  } else {
    withoutTimestampEvents = events;
  }

  if (!!withoutTimestampEvents.length) {
    log.info(`Getting block timestamps for ${withoutTimestampEvents.length} events`);
    const blockNumbers = withoutTimestampEvents.map(({ blockNumber }) => blockNumber);
    const blockNumberMethods = blockNumbersToMethods(blockNumbers);
    const batchRequester = getWeb3().BatchRequest();
    blockNumberMethods.forEach(method => {
      batchRequester.add(method);
    });

    const payload = await batchRequester.execute();

    const newBlockTimestamps = payload.response.map(({
      number,
      timestamp,
    }) => ({
      blockNumber: number,
      timestamp,
    }));

    if (payload.response.length) {
      log.info(`Saving ${newBlockTimestamps.length} block-timestamps to database`);

      await BlockTimestamp.insertMany(newBlockTimestamps);
    }
  }
};

const singleEventTypeBlockTimestampRunner = async (
  acc,
  [
    eventName,
    model,
  ]
) => {
  await acc;
  log.info(`Checking for timestamp availability for event: ${eventName}`);
  const events = await model.find();
  const chunkedEvents = chunkArr(events, chunkSize);
  return chunkedEvents.reduce(
    chunkedEventsReducerFactory,
    Promise.resolve(),
  );
};

const compoundBlockTimestampRunner = async () => {
  setCurrentRunnerModelsConfig(compoundEventNamesToColumnNamesMap);
  const modelConfig = getCurrentRunnerModelConfig();
  await Object.entries(modelConfig)
    .reduce(
      singleEventTypeBlockTimestampRunner,
      Promise.resolve()
    );
};

const dharmaBlockTimestampRunner = async () => {
  setCurrentRunnerModelsConfig(dharmaEventNamesToColumnNamesMapDebtKernel);
  const modelConfig = getCurrentRunnerModelConfig();
  await Object.entries(modelConfig)
    .reduce(
      singleEventTypeBlockTimestampRunner,
      Promise.resolve()
    );
};

const makerBlockTimestampRunner = async () => {
  setCurrentRunnerModelsConfig(
    makerSigsModelConfig,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  await Object.entries(modelConfig)
    .reduce(
      singleEventTypeBlockTimestampRunner,
      Promise.resolve()
    );
};

const allAdaptersBlockTimestampRunner = async () => {
  await compoundBlockTimestampRunner();
  await dharmaBlockTimestampRunner();
  await makerBlockTimestampRunner();
};

export default allAdaptersBlockTimestampRunner;
