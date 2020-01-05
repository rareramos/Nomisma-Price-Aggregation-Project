/* eslint-disable import/no-extraneous-dependencies */
import {
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
  BlockTimestamp,
} from 'price-aggregation-db';
import { GetBlockByNumberMethod } from 'web3-core-method';
import * as Utils from 'web3-utils';
import { formatters } from 'web3-core-helpers';
import { log } from '../../utils/logger';
import { getWeb3 } from '../generic';
import { chunkArr } from '../../utils/chunk-arr';
import { compoundEventNamesToColumnNamesMap } from '../compound/config';
import environment from '../../../environment';
import { dharmaEventNamesToColumnNamesMapDebtKernel } from '../dharma/config';
import { makerSigsModelConfig } from '../maker/config';

const { app } = environment;

const chunkSize = parseInt(app.BATCH_TIMESTAMP_ARR_CHUNK_SIZE, 10);

const blockNumbersToMethods = blockNumbers => blockNumbers.map((blockNumber) => {
  const method = new GetBlockByNumberMethod(Utils, formatters, {});
  method.setArguments([blockNumber, false]);
  method.callback = () => {};
  return method;
});

export const chunkedEventsReducerFactory = async (
  acc,
  events,
) => {
  await acc;
  const blockTimestamps = events
    .map(
      (
        {
          blockNumber,
        },
      ) => blockNumber,
    );
  const existingBlockDetails = await BlockTimestamp.find(
    {
      blockNumber: {
        $in: blockTimestamps,
      },
    },
  );
  let withoutTimestampEvents;
  if (existingBlockDetails.length) {
    const blockDetailsHash = existingBlockDetails.reduce(
      (
        fullBlockDetails,
        detail,
      ) => ({
        ...fullBlockDetails,
        [detail.blockNumber]: detail.timestamp,
      }),
      {},
    );
    withoutTimestampEvents = [];
    events.forEach((evt) => {
      if (!blockDetailsHash[evt.blockNumber]) {
        withoutTimestampEvents.push(evt);
      }
    });
  } else {
    withoutTimestampEvents = events;
  }

  if (withoutTimestampEvents.length) {
    log.debug({
      message: `Getting block timestamps for ${withoutTimestampEvents.length} events`,
    });

    const blockNumbers = withoutTimestampEvents.map(({ blockNumber }) => blockNumber);
    const blockNumberMethods = blockNumbersToMethods(blockNumbers);
    const batchRequester = getWeb3().BatchRequest();
    blockNumberMethods.forEach((method) => {
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
      log.debug({
        message: `Saving ${newBlockTimestamps.length} block-timestamps to database`,
      });

      await BlockTimestamp.insertMany(newBlockTimestamps);
    }
  }
};

export const chunkedBlockNumberProcessor = async (blockNumbers) => {
  const existingBlockDetails = await BlockTimestamp.find(
    {
      blockNumber: {
        $in: blockNumbers,
      },
    },
  );
  let withoutTimestampBlocks;
  if (existingBlockDetails.length) {
    const blockDetailsHash = existingBlockDetails.reduce(
      (
        fullBlockDetails,
        detail,
      ) => ({
        ...fullBlockDetails,
        [detail.blockNumber]: detail.timestamp,
      }),
      {},
    );
    withoutTimestampBlocks = [];
    blockNumbers.forEach((blockNumber) => {
      if (!blockDetailsHash[blockNumber]) {
        withoutTimestampBlocks.push(blockNumber);
      }
    });
  } else {
    withoutTimestampBlocks = blockNumbers;
  }

  if (withoutTimestampBlocks.length) {
    log.debug({
      message: `Getting block timestamps for ${withoutTimestampBlocks.length} blocks`,
    });

    const blockNumberMethods = blockNumbersToMethods(withoutTimestampBlocks);
    const batchRequester = getWeb3().BatchRequest();
    blockNumberMethods.forEach((method) => {
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
      log.debug({
        message: `Saving ${newBlockTimestamps.length} block-timestamps to database`,
      });

      await BlockTimestamp.insertMany(newBlockTimestamps);
    }
  }
};

const getBlockNumberSet = async (eventTableMap) => {
  setCurrentRunnerModelsConfig(eventTableMap);
  const modelConfig = getCurrentRunnerModelConfig();
  const blocks = await Promise.all(
    Object.values(modelConfig).map(
      model => model.distinct('blockNumber'),
    ),
  );
  return new Set([].concat(...blocks));
};

const getCompoundBlocks = async () => getBlockNumberSet(compoundEventNamesToColumnNamesMap);

const getDharmaBlocks = async () => getBlockNumberSet(dharmaEventNamesToColumnNamesMapDebtKernel);

const getMakerBlocks = async () => getBlockNumberSet(makerSigsModelConfig);

const allAdaptersBlockTimestampRunner = async () => {
  const compoundBlocks = await getCompoundBlocks();
  const dharmaBlocks = await getDharmaBlocks();
  const makerBlocks = await getMakerBlocks();
  const allBlocks = Array.from(
    new Set([...compoundBlocks, ...dharmaBlocks, ...makerBlocks]),
  );

  const chunkedBlocks = chunkArr(allBlocks, chunkSize);
  await Promise.all(chunkedBlocks.map(chunkedBlockNumberProcessor));
};

export default allAdaptersBlockTimestampRunner;
