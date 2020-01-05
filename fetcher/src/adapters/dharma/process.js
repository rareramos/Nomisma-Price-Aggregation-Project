import {
  BlockTimestamp,
  DharmaDataCurrentTimestamp,
  DharmaTableData,
  DharmaTermsContractRepayParams,
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
} from 'price-aggregation-db';
import {
  collateralLockedEventName,
  debtOrderFilledEventName,
  dharmaEventNamesToColumnNamesMapDebtKernel,
  dharmaEventNamesToColumnNamesMapTermsContract,
  dharmaEventNamesToColumnsMapCollateralizer,
  dharmaEventNameToColumnsMapRepaymentRouter,
  interestTermStartEventName,
  routerRepayEventName,
} from './config';
import { getWeb3 } from '../generic';
import { bnToFloatStringWithFractionDecimals } from '../../utils/bn-float';
import { getCacheAllTokens } from '../tokens';
import { log } from '../../utils/logger';
import { getCurrentConvertRate } from '../exchange-rates';
import { getToBlock } from '../timestamp/common';
import {
  RATE_PRECISION,
  RATE_PRECISION_POWER,
  calculateLoanApr,
} from '../apr';

const web3 = getWeb3();

const BN = web3.utils.BN;

const lastBlockRecordName = 'dharma-last-block';

const insertToHashByKey = ({
  hash,
  item,
  idKey,
  propKey,
  isArray = false,
}) => {
  if (hash[item[idKey]]) {
    if (isArray) {
      if (hash[item[idKey]][propKey]) {
        hash[item[idKey]] = {
          ...hash[item[idKey]],
          [propKey]: [
            ...hash[item[idKey]][propKey],
            item,
          ],
        };
      } else {
        hash[item[idKey]] = {
          ...hash[item[idKey]],
          [propKey]: [item],
        };
      }
    } else {
      hash[item[idKey]] = {
        ...hash[item[idKey]],
        [propKey]: item,
      };
    }
  } else {
    if (isArray) {
      hash[item[idKey]] = {
        [propKey]: [item],
      };
    } else {
      hash[item[idKey]] = {
        [propKey]: item,
      };
    }
  }
};

const processCollateralEvents = async ({
  hash,
}) => {
  setCurrentRunnerModelsConfig(
    dharmaEventNamesToColumnsMapCollateralizer,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const collateralLockedModel = modelConfig[collateralLockedEventName];
  const collateralLockedItems = await collateralLockedModel.find();
  collateralLockedItems.forEach(item => {
    insertToHashByKey({
      item,
      hash,
      idKey: 'agreementID',
      propKey: 'collateralAdded',
    });
  });
  return hash;
};

const processDebtOrderFilledEvents = async ({
  hash,
}) => {
  setCurrentRunnerModelsConfig(
    dharmaEventNamesToColumnNamesMapDebtKernel,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const debtOrderFilledModel = modelConfig[debtOrderFilledEventName];
  const debtOrderFilledItems = await debtOrderFilledModel.find();
  debtOrderFilledItems.forEach(item => {
    insertToHashByKey({
      item,
      hash,
      idKey: '_agreementId',
      propKey: 'debtOrderFilled',
    });
  });
  return hash;
};

const processContractTermsEvents = async ({
  hash,
}) => {
  setCurrentRunnerModelsConfig(
    dharmaEventNamesToColumnNamesMapTermsContract,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const debtTermsStartModel = modelConfig[interestTermStartEventName];
  const debtTermsStartItems = await debtTermsStartModel.find();
  debtTermsStartItems.forEach(item => {
    insertToHashByKey({
      item,
      hash,
      idKey: 'agreementId',
      propKey: 'contractTermsStart',
    });
  });
  return hash;
};

const processRepayRouterEvents = async ({
  hash,
}) => {
  setCurrentRunnerModelsConfig(
    dharmaEventNameToColumnsMapRepaymentRouter,
  );
  const modelConfig = getCurrentRunnerModelConfig();
  const repayModel = modelConfig[routerRepayEventName];
  const repayItems = await repayModel.find();
  repayItems.forEach(item => {
    insertToHashByKey({
      item,
      hash,
      isArray: true,
      idKey: '_agreementId',
      propKey: 'repayments',
    });
  });
  return hash;
};

const processRepayStates = async ({
  hash,
}) => {
  const repayItems = await DharmaTermsContractRepayParams.find();
  repayItems.forEach(item => {
    insertToHashByKey({
      item,
      hash,
      idKey: 'agreementId',
      propKey: 'currentState',
    });
  });
  return hash;
};

const processDharmaHash = async ({
  hash,
}) => {
  const dharmaDataArr = Object.values(hash);
  const blockNumbersNeeded = dharmaDataArr.map(item => item.debtOrderFilled.blockNumber);
  const blockTimestamps = await BlockTimestamp.find({
    blockNumber: { $in: blockNumbersNeeded },
  });
  const blockTimestampsHash = {};
  blockTimestamps.forEach(item => {
    blockTimestampsHash[item.blockNumber] = item;
  });

  const tokens = await getCacheAllTokens();

  return dharmaDataArr.reduce(
    async (
      acc,
      {
        debtOrderFilled,
        currentState,
        collateralAdded,
      }) => {
      const newAcc = await acc;
      const token = tokens[debtOrderFilled._principalToken.toLowerCase()];
      let toReturn;
      if (!token) {
        log.info(`Failed to find token ${debtOrderFilled._principalToken}`);
        toReturn = acc;
      } else {
        let collateralSymbol;
        let ccr;
        if (!!collateralAdded) {
          const collateralToken = tokens[collateralAdded.token.toLowerCase()];
          if (collateralToken) {
            collateralSymbol = collateralToken.symbol;
            const exchangeRate = await getCurrentConvertRate({
              symbol: collateralSymbol,
              convert: token.symbol,
            });
            const exchangeRateBN = new BN(exchangeRate * RATE_PRECISION.toNumber());
            const collateralAmountBN = new BN(collateralAdded.amount);
            const collateralInTokenTerms = collateralAmountBN
              .mul(exchangeRateBN)
              .mul(new BN(10).pow(new BN(token.decimals)))
              .div(new BN(10).pow(new BN(collateralToken.decimals)))
              .div(RATE_PRECISION);
            ccr = bnToFloatStringWithFractionDecimals(
              collateralInTokenTerms
                .mul(RATE_PRECISION)
                .mul(new BN(100))
                .div(new BN(debtOrderFilled._principal)),
              RATE_PRECISION_POWER,
              3,
            );
          } else {
            collateralSymbol = null;
            ccr = null;
            log.info(`Failed to find collateral token ${collateralAdded.token}`);
          }
        } else {
          collateralSymbol = null;
          ccr = '0';
        }
        const timestampEnd = currentState.termsEndTimestamp;
        const timestampStart = blockTimestampsHash[debtOrderFilled.blockNumber].timestamp;
        let toConvertRepayValue;
        if (currentState.expectedRepaymentValue === '0') {
          toConvertRepayValue = '0';
        } else {
          const repaidWithPrecision = new BN(currentState.repaidToDateValue)
            .mul(RATE_PRECISION)
            .mul(new BN(100))
            .div(new BN(currentState.expectedRepaymentValue));

          if (repaidWithPrecision.gt(RATE_PRECISION)) {
            toConvertRepayValue = RATE_PRECISION
              .mul(new BN(100))
              .toString();
          } else {
            toConvertRepayValue = repaidWithPrecision.toString();
          }
        }
        const repaidPercentage = bnToFloatStringWithFractionDecimals(
          toConvertRepayValue,
          RATE_PRECISION_POWER,
          3
        );
        const principalFloat = bnToFloatStringWithFractionDecimals(
          debtOrderFilled._principal,
          token.decimals,
          4,
        );
        const usdExchangeRate = await getCurrentConvertRate({
          symbol: token.symbol,
          convert: 'USD',
        });
        const exchangeRateBN = new BN(usdExchangeRate * RATE_PRECISION.toNumber());
        const principalUsdInBase = new BN(debtOrderFilled._principal)
          .mul(exchangeRateBN)
          .div(RATE_PRECISION)
          .toString();
        const principalUsd = bnToFloatStringWithFractionDecimals(
          principalUsdInBase,
          token.decimals,
          4,
        );
        const newItem = {
          repaidPercentage,
          loanTimestamp: timestampStart,
          loanSymbol: token.symbol,
          principalUsd,
          collateralSymbol,
          ccr,
          principal: principalFloat,
          loanTermSeconds: new BN(timestampEnd)
            .sub(new BN(timestampStart))
            .toNumber(),
          apr: calculateLoanApr({
            timestampStart,
            timestampEnd,
            principal: debtOrderFilled._principal,
            interest: new BN(currentState.expectedRepaymentValue)
              .sub(new BN(debtOrderFilled._principal))
              .toString(),
            repaidPercentage: new BN(currentState.repaidToDateValue)
              .gte(new BN(currentState.expectedRepaymentValue)) ? '100' : RATE_PRECISION
                .mul(new BN(currentState.repaidToDateValue))
                .div(new BN(currentState.expectedRepaymentValue))
                .mul(new BN(100))
                .toNumber() / RATE_PRECISION.toNumber(),
          }),
          platform: 'Dharma',
          principalTokenName: token.name,
          transactionHash: debtOrderFilled.transactionHash,
        };
        toReturn = [...newAcc, newItem];
      }
      return toReturn;
    },
    []
  );
};

const saveDharmaItems = async items => {
  const lastBlock = await getToBlock();

  const itemsWithBlock = items.map(item => ({
    ...item,
    updateBlock: lastBlock,
  }));
  log.info(`Saving ${itemsWithBlock.length} Dharma loan records to db.`);
  await DharmaTableData.insertMany(itemsWithBlock);

  const timestampObjArr = await DharmaDataCurrentTimestamp.find();

  if (!timestampObjArr.length) {
    const newTimestampObj = {
      currentBlock: lastBlock,
      name: lastBlockRecordName,
    };
    await DharmaDataCurrentTimestamp.insertOne(newTimestampObj);
  } else {
    await DharmaDataCurrentTimestamp.updateOne({
      name: lastBlockRecordName,
    }, {
      $set: { currentBlock: lastBlock },
    });
  }
};

const runDharma = async () => {
  let hash = {};
  hash = await processCollateralEvents({ hash });
  hash = await processDebtOrderFilledEvents({ hash });
  hash = await processContractTermsEvents({ hash });
  hash = await processRepayRouterEvents({ hash });
  hash = await processRepayStates({ hash });
  const items = await processDharmaHash({ hash });
  await saveDharmaItems(items);
};

export default runDharma;
