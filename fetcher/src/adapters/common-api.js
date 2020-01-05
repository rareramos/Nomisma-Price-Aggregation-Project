import { log } from '../utils/logger';
import { getToBlock } from './timestamp/common';

class AllEventsProperDecoder {
  constructor(abiCoder) {
    this.abiCoder = abiCoder;
  }

  decode(abiModel, response) {
    return {
      transactionHash: response.transactionHash,
      blockNumber: response.blockNumber,
      raw: {
        data: response.data,
        topics: response.topics,
      },
    };
  }
}

const createAllEventsLogDecoder = () => new AllEventsProperDecoder(this.abiCoder);

const serialiseAndStore = async ({
  events,
  model,
  serializer,
  rawSerializer,
}) => {
  log.debug({
    message: `Got ${events.length} events. Mapping`,
  });

  let mappedEvents;
  if (rawSerializer) {
    mappedEvents = serializer(
      events.map(
        (
          {
            raw,
            blockNumber,
            transactionHash,
          },
        ) => ({
          ...raw,
          blockNumber,
          transactionHash,
        }),
      ),
    );
  } else {
    mappedEvents = serializer(
      events.map(
        (
          {
            returnValues,
            blockNumber,
            transactionHash,
          },
        ) => ({
          ...returnValues,
          blockNumber,
          transactionHash,
        }),
      ),
    );
  }
  if (mappedEvents.length) {
    log.debug({
      message: `Writting ${mappedEvents.length} events into database`,
    });

    await model.insertMany(mappedEvents);
  }
};

export const getBlockConfig = async (model) => {
  log.debug({
    message: 'Determining origin block and last block',
  });

  const lastCursor = await model.aggregate([
    { $sort: { blockNumber: -1 } },
    { $limit: 1 },
  ]);
  const lastArr = await lastCursor.toArray();
  const last = lastArr[0];
  let fromBlock;
  if (last && last.blockNumber > 0) {
    fromBlock = last.blockNumber + 1;
  } else {
    fromBlock = 0;
  }

  log.debug({
    message: `Origin block is ${fromBlock}`,
  });

  const toBlock = await getToBlock();
  return {
    fromBlock,
    toBlock,
  };
};

export const eventFetchingChunksAmt = 10;

export const getEventOfTypeChunkingFetcher = async ({
  contract,
  eventName,
  fromBlock,
  toBlock,
  topics,
  serializer,
  model,
  rawSerializer,
}) => {
  let events;
  try {
    const opts = {
      fromBlock,
      toBlock,
    };
    if (topics) {
      opts.topics = topics;
    }
    events = await contract.getPastEvents(eventName, opts);
    await serialiseAndStore({
      events,
      model,
      serializer,
      rawSerializer,
    });
  } catch (e) {
    log.error({
      message: `Getting events thrown with error: ${e.message}`,
    });

    if (!e.message || !e.message.includes('query returned more than 1000 results')) {
      throw e;
    } else {
      const diffBlocks = toBlock - fromBlock;
      const chunkBlocks = Math.floor(diffBlocks / eventFetchingChunksAmt);

      log.debug({
        message: `Falling back to chunked fetch with ${chunkBlocks} blocks per chunk`,
      });

      events = await new Array(eventFetchingChunksAmt + 1).fill()
        .reduce(async (acc, _, idx) => {
          const newAcc = await acc;
          const chunkFromBlock = fromBlock + (chunkBlocks * idx);
          let chunkToBlock;
          if (idx === eventFetchingChunksAmt) {
            chunkToBlock = toBlock;
          } else {
            // not inclusive
            chunkToBlock = fromBlock + (chunkBlocks * (idx + 1)) - 1;
            if (chunkToBlock === (toBlock - 1)) {
              chunkToBlock = toBlock;
            }
          }

          let updatedAcc;
          if (chunkFromBlock === chunkToBlock) {
            updatedAcc = [];
          } else {
            log.debug({
              message: `Fetching chunk ${idx} for range from: ${chunkFromBlock} to: ${chunkToBlock}`,
            });

            updatedAcc = await getEventOfTypeChunkingFetcher({
              contract,
              eventName,
              fromBlock: chunkFromBlock,
              toBlock: chunkToBlock,
              serializer,
              model,
              topics,
              rawSerializer,
            });

            log.debug({
              message: `Fetched ${updatedAcc.length} events in chunk`,
            });
          }

          return [
            ...newAcc,
            ...updatedAcc,
          ];
        },
        Promise.resolve([]));
    }
  }
  return events;
};

export const getEventOfTypeFactory = ({
  contract,
  _fromBlock = null,
  useTopics = false,
  toBlock = null,
  serializer = data => data,
  rawSerializer = false,
}) => async (
  acc,
  [
    eventName,
    model,
  ],
) => {
  await acc;
  const {
    fromBlock,
    toBlock: lastBlock,
  } = await getBlockConfig(model);
  let toUseToBlock;
  if (toBlock) {
    toUseToBlock = toBlock;
  } else {
    toUseToBlock = lastBlock;
  }
  let toUseFromBlock;
  if (_fromBlock) {
    log.debug({
      message: `Using preconfigured from block ${_fromBlock}`,
    });

    toUseFromBlock = _fromBlock;
  } else {
    toUseFromBlock = fromBlock;
  }
  let toUseEventName;
  let toUseTopics;
  if (useTopics) {
    log.debug({
      message: `Getting past events of type ${eventName.sig} from block ${toUseFromBlock} to block ${toUseToBlock}`,
    });

    toUseEventName = 'allEvents';
    toUseTopics = eventName.hashes;
    // contract decoder becomes pretty dumb so we have to provide
    // our own
    contract.contractModuleFactory.createAllEventsLogDecoder = createAllEventsLogDecoder;
  } else {
    log.debug({
      message: `Getting past events of type ${eventName} from block ${toUseFromBlock} to block ${toUseToBlock}`,
    });

    toUseEventName = eventName;
    toUseTopics = null;
  }
  return getEventOfTypeChunkingFetcher({
    contract,
    eventName: toUseEventName,
    topics: toUseTopics,
    fromBlock: toUseFromBlock,
    toBlock: toUseToBlock,
    serializer,
    model,
    rawSerializer,
  });
};
