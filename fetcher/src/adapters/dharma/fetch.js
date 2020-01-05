import {
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
  DharmaTermsContractRepayParams,
} from 'price-aggregation-db';
import {
  dataToCallMethod,
  getContract,
  getWeb3,
} from '../generic';
import environment from '../../../environment';
import {
  collateralisedTermsAbi,
  dharmaEventNamesToColumnNamesMapDebtKernel,
  dharmaEventNamesToColumnNamesMapDebtRegistry,
  dharmaEventNamesToColumnNamesMapTermsContract,
  dharmaEventNamesToColumnsMapCollateralizer,
  dharmaEventNameToColumnsMapRepaymentRouter,
  getCollateraliserContract,
  getDebtKernelContract,
  getDebtRegistryContract,
  getRepaymentRouterContract,
  insertEntryEventName,
} from './config';
import { getEventOfTypeFactory } from '../common-api';
import { chunkArr } from '../../utils/chunk-arr';
import { log } from '../../utils/logger';
import { getToBlock } from '../timestamp/common';

const getTermsContractsHashAndLogEntryEvents = async () => {
  setCurrentRunnerModelsConfig(dharmaEventNamesToColumnNamesMapDebtRegistry);
  const modelHash = getCurrentRunnerModelConfig();
  const model = modelHash[insertEntryEventName];
  const events = await model.find();
  const termsContractsHash = {};
  const termsContractsToAgreementIdsHash = {};
  events.forEach((event) => {
    if (!termsContractsHash[event.termsContract]) {
      termsContractsHash[event.termsContract] = true;
    }
    if (!termsContractsToAgreementIdsHash[event.termsContract]) {
      termsContractsToAgreementIdsHash[event.termsContract] = [event.agreementId];
    } else {
      termsContractsToAgreementIdsHash[event.termsContract] = [
        ...termsContractsToAgreementIdsHash[event.termsContract],
        event.agreementId,
      ];
    }
  });
  return {
    termsContractsHash,
    termsContractsToAgreementIdsHash,
  };
};

const getRepaymentValues = async ({
  chunk,
  collateralisedTermsContract,
  termsEndTimestampPayloads,
}) => {
  const web3 = getWeb3();
  const expectedRepaymentValueMethods = chunk.map(
    (
      agreementId,
      idx,
    ) => collateralisedTermsContract.methods.getExpectedRepaymentValue(
      agreementId,
      termsEndTimestampPayloads[idx],
    ).encodeABI(),
  )
    .map(
      data => dataToCallMethod({
        data,
        contractAddress: collateralisedTermsContract.address,
      }),
    );
  const repaymentValueBatchRequester = web3.BatchRequest();
  expectedRepaymentValueMethods.forEach((method) => {
    repaymentValueBatchRequester.add(method);
  });
  const repaymentValuePayload = await repaymentValueBatchRequester.execute();
  return repaymentValuePayload.response.map(
    item => web3.utils.toBN(item).toString(),
  );
};

const getTermsEndsAndRepaidToDateValuesForChunk = async ({
  chunk,
  collateralisedTermsContract,
}) => {
  const web3 = getWeb3();
  const termsEndTimestampsMethods = chunk.map(
    agreementId => collateralisedTermsContract.methods.getTermEndTimestamp(
      agreementId,
    ).encodeABI(),
  )
    .map(
      data => dataToCallMethod({
        data,
        contractAddress: collateralisedTermsContract.address,
      }),
    );
  const repaidToDateValuesMethods = chunk.map(
    agreementId => collateralisedTermsContract.methods.getValueRepaidToDate(
      agreementId,
    ).encodeABI(),
  )
    .map(
      data => dataToCallMethod({
        data,
        contractAddress: collateralisedTermsContract.address,
      }),
    );
  const batchRequester = web3.BatchRequest();
  const concatenatedMethodsArr = [
    ...termsEndTimestampsMethods,
    ...repaidToDateValuesMethods,
  ];
  concatenatedMethodsArr.forEach((method) => {
    batchRequester.add(method);
  });
  const concatPayload = await batchRequester.execute();
  const parsedConcatPayload = concatPayload.response.map(
    item => web3.utils.toBN(item).toString(),
  );
  const termsEndTimestampPayloads = parsedConcatPayload.slice(
    0,
    concatenatedMethodsArr.length / 2,
  );
  const repaidToDateValuePayloads = parsedConcatPayload.slice(
    concatenatedMethodsArr.length / 2,
    concatenatedMethodsArr.length,
  );
  return {
    termsEndTimestampPayloads,
    repaidToDateValuePayloads,
  };
};

const fetchContractTermsStateParams = async () => {
  const {
    termsContractsHash: termsHash,
    termsContractsToAgreementIdsHash,
  } = await getTermsContractsHashAndLogEntryEvents();
  const termsArr = Object.keys(termsHash);

  log.debug({
    message: `Starting to fetch contract terms params for ${termsArr.length} terms contracts`,
  });

  const lastBlock = await getToBlock();
  return termsArr.reduce(
    async (
      acc,
      contractAddress,
    ) => {
      await acc;
      const collateralisedTermsContract = getContract({
        abi: collateralisedTermsAbi,
        contractAddress,
      });
      const agreementIds = termsContractsToAgreementIdsHash[contractAddress];
      const toFilterOutAgreementIds = await DharmaTermsContractRepayParams.find({
        agreementId: {
          $in: agreementIds,
        },
        updateBlock: {
          $gt: lastBlock - parseInt(
            environment.blockchain.BALANCES_UPDATE_BLOCK_INTERVAL,
            10,
          ),
        },
      });
      const toUpdateAgreementIdsObjects = await DharmaTermsContractRepayParams.find({
        agreementId: {
          $in: agreementIds,
        },
        updateBlock: {
          $lte: lastBlock - parseInt(
            environment.blockchain.BALANCES_UPDATE_BLOCK_INTERVAL,
            10,
          ),
        },
      });
      const toUpdateAgreementIdsHash = {};
      toUpdateAgreementIdsObjects.forEach(
        (item) => {
          toUpdateAgreementIdsHash[item.agreementId] = true;
        },
      );

      log.debug({
        message: `Wont fetch params for ${
          toFilterOutAgreementIds.length
        } agreements as already have recent details on them`,
      });

      const toFilterAgreementIdsHash = {};
      toFilterOutAgreementIds.forEach((item) => {
        toFilterAgreementIdsHash[item.agreementId] = true;
      });
      const filteredAgreementIds = agreementIds.filter(id => !toFilterAgreementIdsHash[id]);
      const chunkedAgreementIds = chunkArr(filteredAgreementIds, 500);

      log.debug({
        message: `Starting to fetch contract terms params for contract ${
          contractAddress
        } for ${
          filteredAgreementIds.length
        } agreements with ${chunkedAgreementIds.length} chunks`,
      });

      return chunkedAgreementIds.reduce(
        async (
          chunksAcc,
          chunk,
        ) => {
          await chunksAcc;

          log.debug({
            message: `Starting to fetch contract terms params for chunk of ${chunk.length} items`,
          });

          const {
            repaidToDateValuePayloads,
            termsEndTimestampPayloads,
          } = await getTermsEndsAndRepaidToDateValuesForChunk({
            chunk,
            collateralisedTermsContract,
          });

          const repaymentValuePayload = await getRepaymentValues({
            termsEndTimestampPayloads,
            chunk,
            collateralisedTermsContract,
          });

          const paramsArr = chunk.map((agreementId, idx) => ({
            agreementId,
            termsEndTimestamp: termsEndTimestampPayloads[idx],
            expectedRepaymentValue: repaymentValuePayload[idx],
            repaidToDateValue: repaidToDateValuePayloads[idx],
            termsContract: contractAddress,
            updateBlock: lastBlock,
          }));

          log.debug({
            message: `Successfully fetched ${paramsArr.length} params. Saving to db`,
          });

          const updateArr = [];
          const insertArr = [];
          paramsArr.forEach((item) => {
            if (toUpdateAgreementIdsHash[item.agreementId]) {
              updateArr.push(item);
            } else {
              insertArr.push(item);
            }
          });
          if (insertArr.length) {
            await DharmaTermsContractRepayParams.insertMany(insertArr);
          }
          updateArr.reduce(async (updateAcc, item) => {
            await updateAcc;
            await DharmaTermsContractRepayParams.replaceOne(
              {
                agreementId: item.agreementId,
              },
              item,
            );
          }, Promise.resolve());
        },
        Promise.resolve(),
      );
    },
    Promise.resolve(),
  );
};

const fetchContractTermsEvents = async () => {
  const {
    termsContractsHash: termsHash,
  } = await getTermsContractsHashAndLogEntryEvents();
  setCurrentRunnerModelsConfig(dharmaEventNamesToColumnNamesMapTermsContract);
  const modelConfig = getCurrentRunnerModelConfig();
  return Object.keys(termsHash).reduce(
    async (
      acc,
      contractAddress,
    ) => {
      await acc;
      const collateralisedTermsContract = getContract({
        abi: collateralisedTermsAbi,
        contractAddress,
      });
      return Object.entries(modelConfig).reduce(
        async (
          innerAcc,
          item,
        ) => {
          await acc;

          log.debug({
            message: `Determining origin block for terms contract ${contractAddress}`,
          });

          const lastCursor = await item[1].aggregate([
            {
              $match: {
                termsContract: contractAddress,
              },
            },
            {
              $sort: {
                blockNumber: -1,
              },
            },
            {
              $limit: 1,
            },
          ]);
          const lastArr = await lastCursor.toArray();
          const last = lastArr[0];
          let fromBlock;
          if (last && last.blockNumber > 0) {
            fromBlock = last.blockNumber + 1;
          } else {
            fromBlock = 0;
          }
          return getEventOfTypeFactory({
            contract: collateralisedTermsContract,
            serializer: items => items.map(
              event => ({
                ...event,
                termsContract: contractAddress,
              }),
            ),
            fromBlock,
          })(innerAcc, item);
        },
        Promise.resolve(),
      );
    },
    Promise.resolve(),
  );
};

const fetchKernel = async () => {
  const debtKernelContract = getDebtKernelContract();
  setCurrentRunnerModelsConfig(
    dharmaEventNamesToColumnNamesMapDebtKernel,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  return Object.entries(modelConfig)
    .reduce(
      getEventOfTypeFactory({
        contract: debtKernelContract,
      }),
      Promise.resolve(),
    );
};

const fetchDebtRegistry = async () => {
  const debtRegistryContract = getDebtRegistryContract();
  setCurrentRunnerModelsConfig(dharmaEventNamesToColumnNamesMapDebtRegistry);
  const modelConfig = getCurrentRunnerModelConfig();
  return Object.entries(modelConfig)
    .reduce(
      getEventOfTypeFactory({
        contract: debtRegistryContract,
      }),
      Promise.resolve(),
    );
};

const fetchCollateraliser = async () => {
  const collateraliserContract = getCollateraliserContract();
  setCurrentRunnerModelsConfig(
    dharmaEventNamesToColumnsMapCollateralizer,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  return Object.entries(modelConfig)
    .reduce(
      getEventOfTypeFactory({
        contract: collateraliserContract,
      }),
      Promise.resolve(),
    );
};

const fetchRepaymentRouterEvents = async () => {
  const repaymentRouterContract = getRepaymentRouterContract();
  setCurrentRunnerModelsConfig(
    dharmaEventNameToColumnsMapRepaymentRouter,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  return Object.entries(modelConfig)
    .reduce(
      getEventOfTypeFactory({
        contract: repaymentRouterContract,
      }),
      Promise.resolve(),
    );
};

const runDharma = async () => {
  await fetchKernel();
  await fetchDebtRegistry();
  await fetchContractTermsEvents();
  await fetchCollateraliser();
  await fetchRepaymentRouterEvents();
  await fetchContractTermsStateParams();
};

export default runDharma;
