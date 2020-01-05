import assert from 'assert';
import {
  getEventOfTypeChunkingFetcher,
  eventFetchingChunksAmt,
} from '../../src/adapters/common-api';

describe('common-api', () => {
  it('getEventOfTypeChunkingFetcher can properly chunk for non-flooring case', async () => {
    let errorThrown = false;
    const chunkIntervals = [];
    const contract = {
      getPastEvents: async (_, {
        fromBlock,
        toBlock,
      }) => {
        if (!errorThrown) {
          errorThrown = true;
          throw new Error('Chunk here please.');
        }
        chunkIntervals.push({
          fromBlock,
          toBlock,
        });
        return Promise.resolve([]);
      },
    };
    const model = {
      insertMany: () => Promise.resolve(),
    };
    const toStartFromBlock = 100;
    const toEndFromBlock = 1000;
    await getEventOfTypeChunkingFetcher({
      contract,
      eventName: 'some',
      fromBlock: toStartFromBlock,
      toBlock: toEndFromBlock,
      serializer: data => data,
      rawSerializer: false,
      model,
    });
    assert.equal(chunkIntervals.length, eventFetchingChunksAmt);
    chunkIntervals.forEach(({
      fromBlock,
      toBlock,
    }, idx, arr) => {
      let properInterval;
      if (idx === 0) {
        properInterval = fromBlock === toStartFromBlock;
      } else if (idx === arr.length - 1) {
        properInterval = toBlock === toEndFromBlock && (fromBlock - arr[idx - 1].toBlock) === 1;
      } else {
        properInterval = (fromBlock - arr[idx - 1].toBlock) === 1;
      }
      assert.ok(properInterval);
    });
  });

  it('getEventOfTypeChunkingFetcher can properly chunk for flooring case', async () => {
    let errorThrown = false;
    const chunkIntervals = [];
    const contract = {
      getPastEvents: async (_, {
        fromBlock,
        toBlock,
      }) => {
        if (!errorThrown) {
          errorThrown = true;
          throw new Error('Chunk here please.');
        }
        chunkIntervals.push({
          fromBlock,
          toBlock,
        });
        return Promise.resolve([]);
      },
    };
    const model = {
      insertMany: () => Promise.resolve(),
    };
    const toStartFromBlock = 100;
    const toEndFromBlock = 1002;
    await getEventOfTypeChunkingFetcher({
      contract,
      eventName: 'some',
      fromBlock: toStartFromBlock,
      toBlock: toEndFromBlock,
      serializer: data => data,
      rawSerializer: false,
      model,
    });
    assert.equal(chunkIntervals.length, eventFetchingChunksAmt + 1);
    chunkIntervals.forEach(({
      fromBlock,
      toBlock,
    }, idx, arr) => {
      let properInterval;
      if (idx === 0) {
        properInterval = fromBlock === toStartFromBlock;
      } else if (idx === arr.length - 1) {
        properInterval = toBlock === toEndFromBlock && (fromBlock - arr[idx - 1].toBlock) === 1;
      } else {
        properInterval = (fromBlock - arr[idx - 1].toBlock) === 1;
      }
      assert.ok(properInterval);
    });
  });
});
