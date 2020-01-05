import fs from 'fs';
import path from 'path';
import {
  BlockTimestamp,
  CompoundBalances,
  CompoundDataCurrentTimestamp,
  CompoundTableData,
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
} from 'price-aggregation-db';
import { utils, api } from '@nomisma/nomisma-contracts-sdk';

import {
  borrowEventName,
  borrowRepaidEventName,
  compoundEventNamesToColumnNamesMap,
  supplyReceivedEventName,
} from '../config';
import {
  dataToCallMethod,
  getContract,
  getWeb3,
} from '../../generic';
import { bnToFloatStringWithFractionDecimals } from '../../../utils/bn-float';
import { getToBlock } from '../../timestamp/common';
import environment from '../../../../environment';
import { chunkArr } from '../../../utils/chunk-arr';
import { log } from '../../../utils/logger';
import { syncIterateLoans } from './sync-iterate';
import { getCacheAllTokens } from '../../tokens';
import { calculateLoanApr, RATE_PRECISION, RATE_PRECISION_POWER } from '../../apr';
import { getCurrentConvertRate } from '../../exchange-rates';

const { mapTimestampToEventsMapped } = api.blockTimestampApi;

const { blockchain } = environment;

const { baseMultiplierBN } = utils;

const abiPath = path.resolve(__dirname, '../market-abi.json');

const abi = fs.readFileSync(abiPath, 'utf8');

const lastBlockRecordName = 'compound-last-block';

const web3 = getWeb3();
const { BN } = web3.utils;

const getExistingBalancesHash = async (
  checkExistingBalanceIdentifiers,
) => {
  const lastBlock = await getToBlock();
  const existingBalances = await CompoundBalances.find({
    filterId: {
      $in: checkExistingBalanceIdentifiers,
    },
    updateBlockNumber: {
      $gt: lastBlock - parseInt(blockchain.BALANCES_UPDATE_BLOCK_INTERVAL, 10),
    },
  });

  log.debug({
    message: `Found ${existingBalances.length} valid balances to reuse`,
  });

  const existingBalancesHash = {};
  existingBalances.forEach(({
    asset,
    account,
    balance,
  }) => {
    if (existingBalancesHash[asset]) {
      existingBalancesHash[asset] = {
        ...existingBalancesHash[asset],
        [account]: balance,
      };
    } else {
      existingBalancesHash[asset] = {
        [account]: balance,
      };
    }
  });
  return existingBalancesHash;
};

const getBalanceRequestArray = ({
  potentiallyRequestBalanceFor,
  existingBalancesHash,
}) => {
  const requestBalanceForHash = {};
  potentiallyRequestBalanceFor.forEach((item) => {
    if (existingBalancesHash[item.asset]) {
      if (!existingBalancesHash[item.asset][item.account]) {
        if (requestBalanceForHash[item.asset]) {
          requestBalanceForHash[item.asset][item.account] = true;
        } else {
          requestBalanceForHash[item.asset] = {
            [item.account]: true,
          };
        }
      }
    } else if (requestBalanceForHash[item.asset]) {
      requestBalanceForHash[item.asset][item.account] = true;
    } else {
      requestBalanceForHash[item.asset] = {
        [item.account]: true,
      };
    }
  });

  return Object.entries(requestBalanceForHash).reduce(
    (
      acc,
      [
        asset,
        addressesObj,
      ],
    ) => [
      ...acc,
      ...Object.entries(addressesObj).reduce(
        (
          innerAcc,
          [address],
        ) => [
          ...innerAcc,
          {
            asset,
            address,
          },
        ],
        [],
      ),
    ],
    [],
  );
};

const postProcessData = async ({
  missingBalancesArray,
  existingBalancesHash,
  mappedLoans,
}) => {
  const missingBalancesHash = {};
  missingBalancesArray.forEach((item) => {
    if (missingBalancesHash[item.asset]) {
      missingBalancesHash[item.asset] = {
        ...missingBalancesHash[item.asset],
        [item.account]: item.balance,
      };
    } else {
      missingBalancesHash[item.asset] = {
        [item.account]: item.balance,
      };
    }
  });
  const dataWithoutUpdateBlock = mappedLoans.map((item) => {
    let currentBalance;
    let newRepaid;
    if (
      !!existingBalancesHash[item.asset]
      && !!existingBalancesHash[item.asset][item.account]
    ) {
      currentBalance = new BN(existingBalancesHash[item.asset][item.account]);
    } else if (!!missingBalancesHash[item.asset] && !!missingBalancesHash[item.asset][item.account]) {
      currentBalance = new BN(missingBalancesHash[item.asset][item.account]);
    } else {
      // repaid or liquidated
      currentBalance = new BN('0');
    }

    if (!item.repaid) {
      const repaidBN = baseMultiplierBN
        .mul(new BN('100'))
        .mul(
          item.principalWithInterest,
        )
        .div(
          currentBalance
            .add(
              new BN(item.principalWithInterest),
            ),
        );
      newRepaid = bnToFloatStringWithFractionDecimals(
        repaidBN.toString(),
        18,
        3,
      );
    } else {
      newRepaid = item.repaid;
    }
    const borrowAmountBN = new BN(item.borrowAmount);
    const principalWithInterestBN = new BN(item.principalWithInterest);
    const interest = currentBalance
      .add(principalWithInterestBN)
      .lt(borrowAmountBN) ? null : currentBalance
        .add(principalWithInterestBN)
        .sub(borrowAmountBN)
        .toString();
    return {
      ...item,
      repaidPercentage: newRepaid,
      interest,
    };
  });
  const toQueryBlockNumbers = dataWithoutUpdateBlock.map(({
    blockNumber,
  }) => blockNumber);
  const blockNumberObjArr = await BlockTimestamp.find({
    blockNumber: { $in: toQueryBlockNumbers },
  });
  const timestampHash = {};
  blockNumberObjArr.forEach(({
    blockNumber,
    timestamp,
  }) => {
    timestampHash[blockNumber] = timestamp;
  });
  const lastBlock = await getToBlock();
  const postProcessedData = dataWithoutUpdateBlock.map(({
    account,
    asset,
    blockNumber,
    borrowAmountWithFee,
    borrowAmount,
    interest,
    repaid,
    transactionHash,
    timestampEnd,
    principal,
    principalWithInterest,
    totalCollateralValueInLoanTokenTermsToDate,
    allCollaterals,
  }) => ({
    account,
    asset,
    blockNumber,
    borrowAmount,
    borrowAmountWithFee,
    timestampEnd,
    interest,
    repaid,
    transactionHash,
    principal,
    principalWithInterest,
    totalCollateralValueInLoanTokenTermsToDate,
    allCollaterals,
    loanTimestamp: timestampHash[blockNumber],
    updateBlock: lastBlock,
  }));
  return {
    postProcessedData,
    compoundCurrentLastBlock: lastBlock,
  };
};

const chunkRequestBalances = async (balanceRequestArray) => {
  const contract = getContract({
    abi,
    contractAddress: environment.blockchain.COMPOUND_ADDRESS,
  });
  const lastBlock = await getToBlock();

  log.debug({
    message: `About to start fetching balances for ${balanceRequestArray.length} accounts`,
  });

  const chunked = chunkArr(balanceRequestArray, 1000);
  return chunked.reduce(async (chunksAcc, chunkedArray) => {
    const newChunksAcc = await chunksAcc;

    log.debug({
      message: `Requesting balances for chunk of ${chunkedArray.length} accounts`,
    });

    const balancesMethods = chunkedArray.map(
      ({
        asset,
        address,
      }) => contract.methods.getBorrowBalance(
        address,
        asset,
      ).encodeABI(),
    ).map(
      data => dataToCallMethod({
        data,
        contractAddress: contract.address,
      }),
    );
    const batchRequester = web3.BatchRequest();
    balancesMethods.forEach((method) => {
      batchRequester.add(method);
    });
    const balancesPayload = await batchRequester.execute();
    const parsedPayload = balancesPayload.response.map(
      unparsedBalance => web3.utils.toBN(unparsedBalance).toString(),
    );
    const compoundBalancesToSave = parsedPayload.map((balance, idx) => ({
      balance,
      asset: chunkedArray[idx].asset,
      account: chunkedArray[idx].address,
      filterId: `${chunkedArray[idx].address}-${chunkedArray[idx].asset}`,
      updateBlockNumber: lastBlock,
    }));

    log.debug({
      message: `Saving balances for chunk of ${chunkedArray.length} accounts to db`,
    });

    await CompoundBalances.insertMany(compoundBalancesToSave);
    return [
      ...newChunksAcc,
      ...compoundBalancesToSave,
    ];
  }, Promise.resolve([]));
};

const calculateAprAndCcrAndMapToTableData = async (loansArr) => {
  const lastBlock = await getToBlock();
  const timestamps = await mapTimestampToEventsMapped(
    {
      getWeb3,
    },
  )(
    [
      {
        blockNumber: lastBlock,
      },
    ],
  );
  const lastBlockTimestamp = timestamps[0].timestamp;
  const tokens = await getCacheAllTokens();
  return loansArr.reduce(
    async (
      acc,
      loan,
    ) => {
      const newAcc = await acc;
      const loanToken = tokens[loan.asset.toLowerCase()];
      let toReturn;
      if (loanToken) {
        const loanSymbol = loanToken.symbol;
        const principalTokenName = loanToken.name;
        const principal = bnToFloatStringWithFractionDecimals(
          loan.borrowAmount,
          loanToken.decimals,
          4,
        );

        const timestampEnd = loan.timestampEnd ? loan.timestampEnd : lastBlockTimestamp;
        let apr;
        if (!loan.interest) {
          log.error({
            message: `Failed to determine apr and interest for loan with asset ${
              loan.asset
            } and account ${
              loan.account
            }`,
          });

          apr = null;
        } else {
          apr = calculateLoanApr({
            timestampStart: loan.loanTimestamp,
            timestampEnd,
            principal: loan.principal,
            interest: loan.interest,
          });
        }
        const principalToUsdRate = await getCurrentConvertRate({
          symbol: loanSymbol,
          convert: 'USD',
        });
        const borrowAmountBN = new BN(loan.borrowAmount);
        const exchangeRateBN = new BN(principalToUsdRate * RATE_PRECISION.toNumber());
        const principalUsdInBase = borrowAmountBN
          .mul(exchangeRateBN)
          .div(RATE_PRECISION)
          .toString();
        const principalUsd = bnToFloatStringWithFractionDecimals(
          principalUsdInBase,
          loanToken.decimals,
          4,
        );

        const ccr = bnToFloatStringWithFractionDecimals(
          loan.totalCollateralValueInLoanTokenTermsToDate
            .mul(RATE_PRECISION)
            .mul(new BN('100'))
            .div(borrowAmountBN)
            .toString(),
          RATE_PRECISION_POWER,
          3,
        );

        const interestInBase = loan.interest || '0';
        const collateralInBase = loan.totalCollateralValueInLoanTokenTermsToDate.toString();
        const repaidInBase = loan.principalWithInterest.toString();

        const item = {
          principalTokenName,
          principalUsd,
          loanSymbol,
          principal,
          repaidPercentage: loan.repaid,
          collateralSymbol: null,
          loanTermSeconds: loan.timestampEnd ? loan.loanTimestamp - loan.timestampEnd : null,
          loanTimestamp: loan.loanTimestamp,
          ccr,
          apr,
          updateBlock: loan.updateBlock,
          platform: 'Compound Finance',
          transactionHash: loan.transactionHash,
          interestInBase,
          principalInBase: loan.principal,
          repaidInBase,
          collateralInBase,
          allCollaterals: loan.allCollaterals,
        };
        toReturn = [
          ...newAcc,
          item,
        ];
      } else {
        log.error({
          message: `Loan token ${loan.asset} not found. Bailing`,
        });

        toReturn = newAcc;
      }
      return toReturn;
    },
    [],
  );
};

const getBlockTimestampsHashForBorrowAndRepayEvents = async ({
  borrowEvents,
  borrowRepaidEvents,
}) => {
  const blockNumbersHash = {};
  borrowEvents.forEach(({ blockNumber }) => {
    if (!blockNumbersHash[blockNumber]) {
      blockNumbersHash[blockNumber] = true;
    }
  });
  borrowRepaidEvents.forEach(({ blockNumber }) => {
    if (!blockNumbersHash[blockNumber]) {
      blockNumbersHash[blockNumber] = true;
    }
  });
  const blockNumbersArr = Object.keys(blockNumbersHash).map(blockNumber => parseInt(blockNumber, 10));
  const blockTimestamps = await BlockTimestamp.find({
    blockNumber: { $in: blockNumbersArr },
  });
  const blockTimestampsHash = {};
  blockTimestamps.forEach((blockTimestamp) => {
    if (!blockTimestampsHash[blockTimestamp.blockNumber]) {
      blockTimestampsHash[blockTimestamp.blockNumber] = blockTimestamp;
    }
  });
  return blockTimestampsHash;
};

const requestMissingBalancesAndPostProcess = async (mappedLoans) => {
  const potentiallyRequestBalanceFor = mappedLoans.filter(
    (
      {
        needsBalanceRequest,
      },
    ) => !!needsBalanceRequest,
  );
  const checkExistingBalanceIdentifiers = potentiallyRequestBalanceFor.reduce(
    (
      acc,
      {
        account,
        asset,
      },
    ) => {
      const id = `${account}-${asset}`;
      let toReturn;
      if (!acc.includes(id)) {
        toReturn = [...acc, id];
      } else {
        toReturn = acc;
      }
      return toReturn;
    },
    [],
  );

  const existingBalancesHash = await getExistingBalancesHash(checkExistingBalanceIdentifiers);

  const balanceRequestArray = getBalanceRequestArray({
    existingBalancesHash,
    potentiallyRequestBalanceFor,
  });

  const missingBalancesArray = await chunkRequestBalances(balanceRequestArray);

  return postProcessData({
    missingBalancesArray,
    existingBalancesHash,
    mappedLoans,
  });
};

const addCollateralDataToMappedLoans = ({
  mappedLoans,
  supplyAddedEvents,
  tokensHash,
}) => {
  // build supply events hash by account
  const supplyEventsAccountHash = {};
  supplyAddedEvents.forEach((event) => {
    if (supplyEventsAccountHash[event.account]) {
      supplyEventsAccountHash[event.account] = [
        ...supplyEventsAccountHash[event.account],
        event,
      ];
    } else {
      supplyEventsAccountHash[event.account] = [
        event,
      ];
    }
  });
  const assetAccountToTotalCollateralHash = {};
  return mappedLoans.reduce(
    async (
      loansAcc,
      loan,
    ) => {
      const allCollaterals = [];
      const newLoansAcc = await loansAcc;
      const supplies = supplyEventsAccountHash[loan.account];
      const loanToken = tokensHash[loan.asset.toLowerCase()];
      const hashKey = `${loan.account}-${loan.asset}`;
      let totalCollateralValueInLoanTokenTermsToDate;
      if (!loanToken) {
        log.error({
          message: `Unable to determine loanToken: ${loan.asset.toLowerCase()} for collateral value calculation`,
        });

        totalCollateralValueInLoanTokenTermsToDate = new BN(0);
      } else if (assetAccountToTotalCollateralHash[hashKey]) {
        totalCollateralValueInLoanTokenTermsToDate = assetAccountToTotalCollateralHash[hashKey];
      } else {
        totalCollateralValueInLoanTokenTermsToDate = await supplies
          .reduce(
            async (
              totalAcc,
              supply,
            ) => {
              const newTotalAcc = await totalAcc;
              const supplyToken = tokensHash[supply.asset.toLowerCase()];
              let supplyContributionBN;
              if (!supplyToken) {
                log.error({
                  message: `Unable to determine token ${
                    supply.asset.toLowerCase()
                    // eslint-disable-next-line max-len
                  }. Supply provided in this token would not contribute to calculation of collateral for loan with txHash: ${
                    loan.transactionHash
                  }`,
                });

                supplyContributionBN = new BN(0);
              } else {
                const exchangeRate = await getCurrentConvertRate({
                  symbol: supplyToken.symbol,
                  convert: loanToken.symbol,
                });
                const exchangeRateBN = new BN(
                  exchangeRate * RATE_PRECISION.toNumber(),
                );
                supplyContributionBN = exchangeRateBN.mul(
                  new BN(supply.amount),
                )
                  .div(RATE_PRECISION);
              }

              allCollaterals.push({
                token: supplyToken.symbol,
                amount: supplyContributionBN.toString(),
              });
              return newTotalAcc.add(supplyContributionBN);
            },
            Promise.resolve(new BN(0)),
          );
        assetAccountToTotalCollateralHash[hashKey] = totalCollateralValueInLoanTokenTermsToDate;
      }
      loan.allCollaterals = allCollaterals;
      return [
        ...newLoansAcc,
        {
          ...loan,
          totalCollateralValueInLoanTokenTermsToDate,
        },
      ];
    },
    Promise.resolve([]),
  );
};

const reconstructLoansWithCumulativeParameters = async () => {
  const modelConfig = getCurrentRunnerModelConfig();
  const borrowTakenModel = modelConfig[borrowEventName];
  const borrowRepaidModel = modelConfig[borrowRepaidEventName];
  const supplyAddedModel = modelConfig[supplyReceivedEventName];

  const borrowEventsCursor = await borrowTakenModel.aggregate([
    { $sort: { blockNumber: 1 } },
  ]);
  const borrowEvents = await borrowEventsCursor.toArray();

  const borrowRepaidEventsCursor = await borrowRepaidModel.aggregate([
    { $sort: { blockNumber: 1 } },
  ]);
  const borrowRepaidEvents = await borrowRepaidEventsCursor.toArray();
  const supplyAddedCursor = await supplyAddedModel.aggregate([
    { $sort: { blockNumber: 1 } },
  ]);
  const supplyAddedEvents = await supplyAddedCursor.toArray();

  const blockTimestamps = await getBlockTimestampsHashForBorrowAndRepayEvents({
    borrowEvents,
    borrowRepaidEvents,
  });

  const mappedLoans = syncIterateLoans({
    borrowEvents,
    borrowRepaidEvents,
    blockTimestamps,
  });

  const tokensHash = await getCacheAllTokens();

  return addCollateralDataToMappedLoans({
    mappedLoans,
    supplyAddedEvents,
    tokensHash,
  });
};

const runCompound = async () => {
  setCurrentRunnerModelsConfig(compoundEventNamesToColumnNamesMap);
  const timestampObjArr = await CompoundDataCurrentTimestamp.find();
  if (!timestampObjArr.length) {
    const lastBlock = await getToBlock();
    const newTimestampObj = {
      currentBlock: lastBlock,
      name: lastBlockRecordName,
    };
    await CompoundDataCurrentTimestamp.insertOne(newTimestampObj);
  }

  const mappedLoans = await reconstructLoansWithCumulativeParameters();

  log.debug({
    message: `Initial iteration revealed ${mappedLoans.length} Compound loans`,
  });

  const {
    postProcessedData,
    compoundCurrentLastBlock,
  } = await requestMissingBalancesAndPostProcess(mappedLoans);

  log.debug({
    message: `Doing final calculations on ${postProcessedData.length} Compound loan records`,
  });

  const properFormatData = await calculateAprAndCcrAndMapToTableData(postProcessedData);

  log.debug({
    message: `Saving ${properFormatData.length} Compound loan records to db.`,
  });

  await CompoundTableData.insertMany(properFormatData);
  await CompoundDataCurrentTimestamp.updateOne({
    name: lastBlockRecordName,
  }, {
    $set: { currentBlock: compoundCurrentLastBlock },
  });
};

export default runCompound;
