/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers';
import {
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
  MakerWipeGovTransfers,
} from 'price-aggregation-db';
import { GetTransactionReceiptMethod } from 'web3-core-method';
import * as Utils from 'web3-utils';
import { formatters } from 'web3-core-helpers';
import environment from '../../../environment';
import {
  getSaiTubContract,
  saiTubAbi,
  makerSigsModelConfig,
  makerOpenModelConfig,
  makerWipeEventName,
} from './config';
import { getWeb3 } from '../generic';
import { getEventOfTypeFactory } from '../common-api';
import { log } from '../../utils/logger';
import { chunkArr } from '../../utils/chunk-arr';

const {
  blockchain: {
    MAKER_TOKEN_CONTRACT_ADDRESS,
    MAKER_PIT_CONTRACT_ADDRESS,
  },
} = environment;

const transactionHashToReceiptMethods = transactionHashes => transactionHashes.map((transactionHash) => {
  const method = new GetTransactionReceiptMethod(Utils, formatters, {});
  method.setArguments([transactionHash]);
  method.callback = () => {};
  return method;
});

export const getSaiTubAbiSigs = filterHash => JSON.parse(saiTubAbi)
  .filter(({ type }) => type === 'function')
  .filter(({ name }) => !!filterHash[name])
  .map(({
    name,
    inputs,
  }) => ({
    name,
    sig: `${name}(${inputs.map(({ type }) => type).join(',')})`,
    inputs,
  }));

const runMakerNoteEvents = async () => {
  const web3 = getWeb3();
  const sigs = getSaiTubAbiSigs(makerSigsModelConfig);
  const hashedSigs = sigs.map(
    sig => web3.utils.sha3(sig.sig)
      .slice(0, 10),
  );
  const fetchHash = {};
  sigs.forEach((sig, idx) => {
    fetchHash[sig.name] = {
      name: sig.name,
      sig: sig.sig,
      inputs: sig.inputs,
      hashes: [`${hashedSigs[idx]}${'0'.repeat(66 - hashedSigs[idx].length)}`],
    };
  });
  const contract = getSaiTubContract();
  setCurrentRunnerModelsConfig(
    makerSigsModelConfig,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const byHashParsers = {};
  Object.entries(fetchHash).forEach(([methodName, { hashes, inputs }]) => {
    byHashParsers[hashes[0]] = { methodName, inputs };
  });
  return Object.entries(modelConfig).reduce(
    (
      acc,
      sig,
    ) => getEventOfTypeFactory({
      contract,
      useTopics: true,
      rawSerializer: true,
      serializer: data => data.map((item) => {
        const {
          inputs,
        } = byHashParsers[item.topics[0]];
        const sender = item.topics[1];
        const valueHash = item.data.slice(2, 66);
        const args = `${item.topics[2].slice(2)}${item.topics[3].slice(2)}`;
        const fullPayload = `${sender}${valueHash}${args}`;
        const coder = new ethers.utils.AbiCoder();
        const fullInputs = [
          {
            type: 'address',
            name: 'sender',
          },
          {
            type: 'uint256',
            name: 'value',
          },
          ...inputs,
        ];
        const parsedResult = {};
        const result = coder.decode(fullInputs, fullPayload);
        fullInputs.forEach(({ name }) => {
          parsedResult[name] = result[name];
          if (
            typeof parsedResult[name] === 'object'
              // eslint-disable-next-line no-underscore-dangle
              && parsedResult[name]._ethersType && parsedResult[name]._ethersType === 'BigNumber'
          ) {
            parsedResult[name] = parsedResult[name].toString();
          }
        });
        return {
          ...parsedResult,
          blockNumber: item.blockNumber,
          transactionHash: item.transactionHash,
        };
      }),
    })(
      acc,
      [
        fetchHash[sig[0]],
        sig[1],
      ],
    ),
    Promise.resolve(),
  );
};

const runMakerOpenEvents = async () => {
  setCurrentRunnerModelsConfig(
    makerOpenModelConfig,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const contract = getSaiTubContract();
  return Object.entries(modelConfig).reduce(
    getEventOfTypeFactory({
      contract,
    }),
    Promise.resolve(),
  );
};

const fetchSaveMakerWipeInterestEvents = async (missingWipeRecords) => {
  const chunked = chunkArr(missingWipeRecords, 1000);
  const web3 = getWeb3();
  const transferEventHash = web3.utils.sha3('Transfer(address,address,uint256)');
  await chunked.reduce(async (acc, chunk) => {
    await acc;

    log.debug({
      message: `About to fetch ${chunk.length} maker wipe balances`,
    });

    const methods = transactionHashToReceiptMethods(chunk);
    const batchRequester = web3.BatchRequest();
    methods.forEach((method) => {
      batchRequester.add(method);
    });
    const payload = await batchRequester.execute();

    log.debug({
      message: `Fetched ${payload.response.length} maker wipe balances. Parsing`,
    });

    const amounts = payload.response.map((receipt) => {
      const transferEvt = receipt.logs.find(
        evtLog => evtLog.address.toLowerCase() === MAKER_TOKEN_CONTRACT_ADDRESS
          && evtLog.topics[0] === transferEventHash
          && evtLog.topics.length === 3
          && `0x${evtLog.topics[2].slice(26, 66)}`.toLowerCase() === MAKER_PIT_CONTRACT_ADDRESS,
      );
      let toReturn;
      if (!transferEvt) {
        toReturn = '0';
      } else {
        toReturn = web3.utils.toBN(transferEvt.data).toString();
      }
      return toReturn;
    });
    const wipeInterestEvents = amounts.map(
      (amount, idx) => ({
        amount,
        transactionHash: chunk[idx],
        tokenAddress: MAKER_TOKEN_CONTRACT_ADDRESS,
      }),
    );

    log.debug({
      message: `Writting ${wipeInterestEvents.length} wipe events into db`,
    });

    await MakerWipeGovTransfers.insertMany(wipeInterestEvents);
  }, Promise.resolve());
};

const runMakerWipeInterestEvents = async () => {
  setCurrentRunnerModelsConfig(
    makerSigsModelConfig,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const wipeModel = modelConfig[makerWipeEventName];
  const makerWipeGovTransfers = await MakerWipeGovTransfers.find();
  const toFilterTxHashes = makerWipeGovTransfers.map(
    (
      {
        transactionHash,
      },
    ) => transactionHash,
  );
  const wipeRecords = await wipeModel.find({
    transactionHash: { $nin: toFilterTxHashes },
  });
  const duplicateWipeRecordsHash = {};
  const missingWipeRecords = wipeRecords
    .map(
      (
        {
          transactionHash,
        },
      ) => transactionHash,
    )
    .filter(
      (txHash) => {
        let toReturn = false;
        if (!duplicateWipeRecordsHash[txHash]) {
          duplicateWipeRecordsHash[txHash] = true;
          toReturn = true;
        }
        return toReturn;
      },
    );

  log.debug({
    message: `Would fetch missing wipe interest events details for ${missingWipeRecords.length} records`,
  });

  return fetchSaveMakerWipeInterestEvents(missingWipeRecords);
};

const runMaker = async () => {
  log.debug({
    message: 'Fetching Maker data',
  });

  await runMakerOpenEvents();
  await runMakerNoteEvents();
  await runMakerWipeInterestEvents();
};

export default runMaker;
