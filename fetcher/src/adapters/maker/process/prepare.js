import {
  MakerOutstandingBalances,
  MakerOutstandingFees,
  MakerWipeGovTransfers,
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
  BlockTimestamp,
} from 'price-aggregation-db';
import {
  dataToCallMethod,
  getWeb3,
} from '../../generic';
import environment from '../../../../environment';
import {
  getSaiTubContract,
  makerDrawEventName,
  makerLockEventName,
  makerOpenEventName,
  makerOpenModelConfig,
  makerSigsModelConfig,
  makerWipeEventName,
} from '../config';
import { log } from '../../../utils/logger';
import { getToBlock } from '../../timestamp/common';
import { chunkedEventsReducerFactory } from '../../timestamp';

const { blockchain } = environment;

/**
 * This function on SaiTub contract given the cup id returns current
 * loan outstanding amount in DAI terms.
 * @type {string}
 */
const daiToRepayBalanceFuncName = 'tab';

/**
 * This function on SaiTub contract given the cup id returns current
 * outstanding interest in MKR terms.
 * @type {string}
 */
const mrkToRepayBalanceFuncName = 'rap';

const getValidExistingBalancesForCups = async cups => {
  const lastBlock = await getToBlock();
  const existingBalances = await MakerOutstandingBalances.find({
    cup: {
      $in: cups,
    },
    updateBlockNumber: {
      $gt: lastBlock - parseInt(blockchain.BALANCES_UPDATE_BLOCK_INTERVAL, 10),
    },
  });
  log.info(`Found ${existingBalances.length} valid balances to reuse`);
  return existingBalances;
};

const getMissingOutstandingBalancesForCups = async ({
  missingBalancesCups,
}) => {
  const contract = getSaiTubContract();
  const web3 = getWeb3();
  const methods = missingBalancesCups.map(
    cup => contract.methods[daiToRepayBalanceFuncName](cup)
      .encodeABI()
  )
    .map(
      data => dataToCallMethod(
        {
          data,
          contractAddress: contract.address,
        }
      )
    );
  const lastBlock = await getToBlock();
  const batchRequester = web3.BatchRequest();
  methods.forEach(method => {
    batchRequester.add(method);
  });
  const balancesPayload = await batchRequester.execute();
  const parsedPayload = balancesPayload.response.map(
    unparsedBalance => web3.utils.toBN(unparsedBalance).toString()
  );
  const resultPayload = parsedPayload.map((balance, idx) => ({
    balance,
    cup: missingBalancesCups[idx],
    updateBlockNumber: lastBlock,
  }));
  if (resultPayload.length) {
    log.info(`Writting ${resultPayload.length} maker balances records in the database`);
    await MakerOutstandingBalances.insertMany(resultPayload);
  }
  return resultPayload;
};

export const mapCupsToOutstandingBalances = async cups => {
  const existingBalances = await getValidExistingBalancesForCups(cups);
  const existingBalancesHash = {};
  existingBalances.forEach(balance => {
    existingBalancesHash[balance.cup] = balance.balance;
  });
  const missingBalances = cups.filter(cup => !existingBalancesHash[cup]);
  const missingBalancesRetrieved = await getMissingOutstandingBalancesForCups({
    missingBalancesCups: missingBalances,
  });
  const missingBalancesRetrievedHash = {};
  missingBalancesRetrieved.forEach(item => {
    missingBalancesRetrievedHash[item.cup] = item.balance;
  });
  const cupsToBalancesHash = {};
  cups.forEach(cup => {
    if (existingBalancesHash[cup]) {
      cupsToBalancesHash[cup] = existingBalancesHash[cup];
    } else {
      cupsToBalancesHash[cup] = missingBalancesRetrievedHash[cup];
    }
  });
  return cupsToBalancesHash;
};

const getCupsToLookForFeesArr = fullHash => {
  const web3 = getWeb3();
  const BN = web3.utils.BN;
  return Object.entries(fullHash).filter(
    (
      [
        ,
        {
          balance,
        },
      ]
    ) => {
      let toReturn = false;
      if (!new BN(balance).eq(new BN(0))) {
        toReturn = true;
      }
      return toReturn;
    })
    .map(
      (
        [
          cup,
        ]
      ) => cup
    );
};

const lookForExistingFeeRecordsForCups = async cups => {
  const lastBlock = await getToBlock();
  // get timestamp for last block
  await chunkedEventsReducerFactory(
    Promise.resolve(),
    [
      {
        blockNumber: lastBlock,
      },
    ]
  );
  const timestampArr = await BlockTimestamp.find({
    blockNumber: lastBlock,
  });
  const lastBlockTimestamp = timestampArr[0].timestamp;
  const existingFeeRecords = await MakerOutstandingFees.find({
    cup: {
      $in: cups,
    },
    updateBlockNumber: {
      $gt: lastBlock - parseInt(blockchain.BALANCES_UPDATE_BLOCK_INTERVAL, 10),
    },
  });
  const existingCupsHash = {};
  existingFeeRecords.forEach(feeRecord => {
    existingCupsHash[feeRecord.cup] = true;
  });
  const existingFeeRecordsHash = {};
  existingFeeRecords.forEach((existingFeeRecord) => {
    existingFeeRecordsHash[existingFeeRecord.cup] = existingFeeRecord;
  });
  return {
    existingFeeRecordsHash,
    missingFeeRecords: cups.filter(cup => !existingCupsHash[cup]),
    lastBlock,
    lastBlockTimestamp,
  };
};

const fetchSaveMissingFeeRecordsForCups = async ({
  cups,
  lastBlock,
}) => {
  const web3 = getWeb3();
  const contract = getSaiTubContract();
  const methods = cups.map(cup =>
    dataToCallMethod({
      data: contract.methods[mrkToRepayBalanceFuncName](cup).encodeABI(),
      contractAddress: contract.address,
    })
  );
  const batchRequester = web3.BatchRequest();
  methods.forEach(method => {
    batchRequester.add(method);
  });
  log.info(`About to request fee balances for ${cups.length} cups`);
  const balancesPayload = await batchRequester.execute();
  const parsedBalances = balancesPayload.response.map(
    unparsedBalance => web3.utils.toBN(unparsedBalance).toString()
  );
  const balanceObjects = parsedBalances.map((balance, idx) => ({
    balance,
    cup: cups[idx],
    updateBlockNumber: lastBlock,
  }));
  log.info(`Writting ${balanceObjects.length} missing fee balance records into db`);
  MakerOutstandingFees.insertMany(balanceObjects);
  const balancesHash = {};
  balanceObjects.forEach((balaceObj) => {
    balancesHash[balaceObj.cup] = balaceObj;
  });
  return balancesHash;
};

/**
 * Given full hash we first check that amount wiped for cup
 * is less than amount borrowed. If balances are equal means that
 * the loan has been fully repaid and outstanding MKR fee is zero.
 *
 * For the case when wiped amount differs from borrowed amount there
 * are some MKR fees outstanding. Then we check if those fees are
 * present in the database already and use them if they are.
 * Otherwise we issue fees fetch directly from SaiTub contract.
 *
 * This function also takes care of getting timestampStart and
 * timestampEnd for each draw. timestampStart is per draw and
 * would be the timestamp of loan origination. timestampEnd is
 * per cup and is either the last wipe's timestamp in case when
 * cup is fully repaid or lastBlockTimestamp otherwise which
 * stands for the case when loan is not repaid in full so
 * all cup loans are current.
 * @param fullHash
 * @returns {Promise<updatedHash>}
 */
export const mapHashToOutstandingInterestFees = async fullHash => {
  const lookForCupsFeesArr = getCupsToLookForFeesArr(fullHash);
  const {
    existingFeeRecordsHash,
    missingFeeRecords,
    lastBlock,
    lastBlockTimestamp,
  } = await lookForExistingFeeRecordsForCups(lookForCupsFeesArr);
  let loadedFeeRecordsHash;
  if (missingFeeRecords.length) {
    loadedFeeRecordsHash = await fetchSaveMissingFeeRecordsForCups({
      cups: missingFeeRecords,
      lastBlock,
    });
  } else {
    loadedFeeRecordsHash = {};
  }

  const web3 = getWeb3();
  const BN = web3.utils.BN;
  Object.keys(fullHash).forEach((cup) => {
    const balance = fullHash[cup].balance;
    if (new BN(balance).eq(new BN(0))) {
      const wipes = fullHash[cup].wipes;
      let lastBlockTimestampForWipe = 0;
      if (wipes.length) {
        wipes.forEach(wipe => {
          if (wipe.timestamp > lastBlockTimestampForWipe) {
            lastBlockTimestampForWipe = wipe.timestamp;
          }
        });
      } else {
        lastBlockTimestampForWipe = lastBlockTimestamp;
      }
      fullHash[cup].timestampEnd = lastBlockTimestampForWipe;
      fullHash[cup].outstandingFee = '0';
    } else if (!!existingFeeRecordsHash[cup]) {
      fullHash[cup].timestampEnd = lastBlockTimestamp;
      fullHash[cup].outstandingFee = existingFeeRecordsHash[cup].balance;
    } else if (!!loadedFeeRecordsHash[cup]) {
      fullHash[cup].timestampEnd = lastBlockTimestamp;
      fullHash[cup].outstandingFee = loadedFeeRecordsHash[cup].balance;
    } else {
      throw new Error('Balance not found');
    }
  });
  return fullHash;
};

export const getCupsCount = async () => {
  setCurrentRunnerModelsConfig(
    makerOpenModelConfig,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const openModel = modelConfig[makerOpenEventName];
  return openModel.countDocuments();
};

export const chunkGetCups = async (offset, chunkSize) => {
  setCurrentRunnerModelsConfig(
    makerOpenModelConfig,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const openModel = modelConfig[makerOpenEventName];
  const chunkCursor = await openModel.aggregate([
    {
      $sort: { blockNumber: -1 },
    },
    {
      $skip: offset,
    },
    {
      $limit: chunkSize,
    },
  ]);
  const items = await chunkCursor.toArray();
  return items.map(({ cup }) => cup);
};

export const buildCollateralizationHash = ({
  cups,
  cupsToDrawsHash,
  cupsToLocksHash,
}) => {
  const collateralizationHash = {};
  cups.forEach(cup => {
    // we ignore plain collateralization without draws here
    if (!collateralizationHash[cup] && cupsToDrawsHash[cup]) {
      collateralizationHash[cup] = [];
    }
    if (cupsToDrawsHash[cup]) {
      cupsToDrawsHash[cup].forEach(draw => {
        const locksForDraw = !cupsToLocksHash[cup]
          ? []
          : cupsToLocksHash[cup].filter(
            lock => lock.blockNumber <= draw.blockNumber
          );
        collateralizationHash[cup] = [
          ...collateralizationHash[cup],
          {
            ...draw,
            locks: locksForDraw,
          },
        ];
      });
    }
  });
  return collateralizationHash;
};

const mapSigsEventToHash = (eventName) => async cups => {
  setCurrentRunnerModelsConfig(
    makerSigsModelConfig,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const model = modelConfig[eventName];
  const items = await model.find({ cup: { $in: cups }});
  const existingBlockNumbers = {};
  const blockNumbers = items
    .map(({ blockNumber }) => blockNumber)
    .filter(blockNum => {
      let toReturn = false;
      if (!existingBlockNumbers[blockNum]) {
        existingBlockNumbers[blockNum] = true;
        toReturn = true;
      }
      return toReturn;
    });
  const blockToTimestampHash = {};
  if (blockNumbers.length) {
    const blockTimestamps = await BlockTimestamp.find({
      blockNumber: { $in: blockNumbers },
    });
    blockTimestamps.forEach(({ blockNumber, timestamp }) => {
      blockToTimestampHash[blockNumber] = timestamp;
    });
  }

  const cupToEventsHash = {};
  items.forEach(item => {
    if (cupToEventsHash[item.cup]) {
      cupToEventsHash[item.cup] = [
        ...cupToEventsHash[item.cup],
        {
          ...item,
          timestamp: blockToTimestampHash[item.blockNumber],
        },
      ];
    } else {
      cupToEventsHash[item.cup] = [
        {
          ...item,
          timestamp: blockToTimestampHash[item.blockNumber],
        },
      ];
    }
  });
  return cupToEventsHash;
};

export const mapCupsToDrawsHash = mapSigsEventToHash(makerDrawEventName);

export const mapCupsToLockHash = mapSigsEventToHash(makerLockEventName);

const mapCupsToWipesHash = mapSigsEventToHash(makerWipeEventName);

const cupsToWipesHashToCupsToFeesHash = async cupsToWipesHash => {
  const duplicatesHash = {};
  const transactionHashes = Object.values(cupsToWipesHash)
    .reduce(
      (
        acc,
        wipesArr,
      ) =>
        [...acc, ...wipesArr],
      []
    )
    .map(
      (
        {
          transactionHash,
        }
      ) => transactionHash
    )
    .filter(
      txHash => {
        let toReturn = false;
        if (!duplicatesHash[txHash]) {
          duplicatesHash[txHash] = true;
          toReturn = true;
        }
        return toReturn;
      }
    );
  const fees = await MakerWipeGovTransfers.find({
    transactionHash: { $in: transactionHashes },
  });
  const txHashTofeesHash = {};
  fees.forEach(fee => {
    txHashTofeesHash[fee.transactionHash] = fee;
  });
  const cupsToFeesHash = {};
  Object.keys(cupsToWipesHash).forEach(cup => {
    const perCupTxHashes = [];
    const duplicatePerCupTxHashes = {};
    cupsToWipesHash[cup].forEach(wipe => {
      if (!duplicatePerCupTxHashes[wipe.transactionHash]) {
        duplicatePerCupTxHashes[wipe.transactionHash] = true;
        perCupTxHashes.push(wipe.transactionHash);
      }
    });
    perCupTxHashes.forEach(txHash => {
      if (!cupsToFeesHash[cup]) {
        cupsToFeesHash[cup] = [];
      }
      cupsToFeesHash[cup] = [
        ...cupsToFeesHash[cup],
        txHashTofeesHash[txHash],
      ];
    });
  });
  return cupsToFeesHash;
};

export const combineDrawLockAndBalanceWithWipe = async ({
  collateralisationHash,
  cupsOutstandingBalances,
}) => {
  const cups = Object.keys(collateralisationHash);
  const cupsToWipesHash = await mapCupsToWipesHash(cups);
  const cupsToFeesHash = await cupsToWipesHashToCupsToFeesHash(cupsToWipesHash);
  const fullHash = {};
  cups.forEach(cup => {
    fullHash[cup] = {
      wipes: !!cupsToWipesHash[cup] ? cupsToWipesHash[cup] : [],
      draws: collateralisationHash[cup],
      balance: cupsOutstandingBalances[cup],
      fees: !!cupsToFeesHash[cup] ? cupsToFeesHash[cup] : [],
    };
  });
  return fullHash;
};

