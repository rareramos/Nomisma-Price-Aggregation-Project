import {
  MakerTableData,
  MakerDataCurrentTimestamp,
} from 'price-aggregation-db';
import { getWeb3 } from '../../generic';
import {
  calculateLoanApr,
  RATE_PRECISION,
  RATE_PRECISION_POWER,
} from '../../apr';
import { bnToFloatStringWithFractionDecimals } from '../../../utils/bn-float';
import { getCurrentConvertRate } from '../../exchange-rates';
import { getCacheAllTokens } from '../../tokens';
import { log } from '../../../utils/logger';

const web3 = getWeb3();

const { BN } = web3.utils;

const lastBlockRecordName = 'maker-last-block';

const getTokenBySymbol = (tokensHash, tokenSymbol) => Object.values(tokensHash)
  .find(
    (
      {
        symbol,
      },
    ) => symbol === tokenSymbol,
  );

const getInterestAmountInDaiForCup = async ({
  fees,
  outstandingFee,
  daiDecimals,
  mkrDecimals,
}) => {
  const interestExchangeRate = await getCurrentConvertRate({
    symbol: 'MKR',
    convert: 'DAI',
  });
  const exchangeRateBN = new BN(interestExchangeRate * RATE_PRECISION.toNumber());
  const interestAmountInMakerBN = fees.reduce(
    (
      feeAcc,
      { amount },
    ) => feeAcc
      .add(new BN(amount)),
    new BN('0'),
  )
    .add(new BN(outstandingFee));
  return interestAmountInMakerBN
    .mul(exchangeRateBN)
    .mul(new BN(10).pow(new BN(daiDecimals)))
    .div(new BN(10).pow(new BN(mkrDecimals)))
    .div(RATE_PRECISION)
    .toString();
};

const calculateHashParams = (
  fullHash,
  tokens,
) => {
  const daiDecimals = getTokenBySymbol(tokens, 'DAI').decimals;
  const mkrDecimals = getTokenBySymbol(tokens, 'MKR').decimals;
  return Object.entries(fullHash).reduce(
    async (
      acc,
      [
        cup,
        {
          balance,
          // wipes,
          draws,
          fees,
          outstandingFee,
          timestampEnd,
        },
      ],
    ) => {
      const newAcc = await acc;
      const timestampStart = draws[0].timestamp;
      const totalPrincipal = draws.reduce(
        (
          total,
          {
            wad,
          },
        ) => total.add(new BN(wad)),
        new BN(0),
      ).toString();
      const principalToUSDExchangeRate = await getCurrentConvertRate({
        symbol: 'DAI',
        convert: 'USD',
      });
      const principlaToUSDExchangeRateBN = new BN(
        principalToUSDExchangeRate * RATE_PRECISION.toNumber(),
      );
      const principalUsdInBase = new BN(totalPrincipal)
        .mul(principlaToUSDExchangeRateBN)
        .div(RATE_PRECISION)
        .toString();
      const principalUsd = bnToFloatStringWithFractionDecimals(
        principalUsdInBase,
        daiDecimals,
        4,
      );
      let repaidPercentageBN = RATE_PRECISION
        .sub(
          new BN(balance)
            .mul(RATE_PRECISION)
            .div(new BN(totalPrincipal)),
        )
        .mul(new BN('100'));
      // for some reason sometimes balance is much greater than
      // accumulated value of all draws. this potentially might be
      // because some loan transfers happen under the hood. we
      // just ignore such cases.
      if (repaidPercentageBN.lt(new BN('0'))) {
        repaidPercentageBN = new BN(0);
      }
      const repaidPercentage = bnToFloatStringWithFractionDecimals(
        repaidPercentageBN.toString(),
        RATE_PRECISION_POWER,
        3,
      );
      const interestAmountInDai = await getInterestAmountInDaiForCup({
        fees,
        outstandingFee,
        daiDecimals,
        mkrDecimals,
      });
      const apr = calculateLoanApr({
        timestampStart,
        timestampEnd,
        principal: totalPrincipal,
        interest: interestAmountInDai,
      });
      const loans = await draws.reduce(
        async (
          loansInnerAcc,
          {
            transactionHash,
            wad,
            locks,
            blockNumber,
            timestamp,
          },
        ) => {
          const newLoansInnerAcc = await loansInnerAcc;
          const locksTotalAmtInEthBN = locks.reduce(
            (
              locksAcc,
              {
                wad: lockWad,
              },
            ) => locksAcc.add(new BN(lockWad)),
            new BN('0'),
          );
          // This selects all draws that occurred before or at
          // the same block as current draw and also sums up
          // the total draw amount for those in order to be able
          // to calculate collateralisation ratio for the current
          // draw.
          const drawsToDateAmtInDaiBN = draws.filter(
            (
              {
                blockNumber: filterDrawBlockNumber,
              },
            ) => filterDrawBlockNumber <= blockNumber,
          ).reduce(
            (
              drawsAcc,
              {
                wad: drawWad,
              },
            ) => drawsAcc.add(new BN(drawWad)),
            new BN('0'),
          );

          const collateralExchangeRate = await getCurrentConvertRate({
            symbol: 'ETH',
            convert: 'DAI',
          });
          const collateralToDaiExchangeRateBN = new BN(
            collateralExchangeRate * RATE_PRECISION.toNumber(),
          );
          const collateralInDaiTermsInBaseBN = locksTotalAmtInEthBN
            .mul(collateralToDaiExchangeRateBN)
            .div(RATE_PRECISION);

          const ccr = bnToFloatStringWithFractionDecimals(
            collateralInDaiTermsInBaseBN
              .mul(RATE_PRECISION)
              .mul(new BN(100))
              .div(drawsToDateAmtInDaiBN),
            RATE_PRECISION_POWER,
            3,
          );

          const item = {
            apr,
            principal: bnToFloatStringWithFractionDecimals(
              wad,
              daiDecimals,
              4,
            ),
            loanTermSeconds: timestampEnd - timestampStart,
            loanTimestamp: timestamp,
            repaidPercentage,
            transactionHash,
            principalUsd,
            collateralSymbol: 'ETH',
            ccr,
            platform: 'Maker',
            loanSymbol: 'DAI',
            cup,
          };
          return [
            ...newLoansInnerAcc,
            item,
          ];
        },
        Promise.resolve([]),
      );
      return [
        ...newAcc,
        ...loans,
      ];
    },
    Promise.resolve([]),
  );
};

const writeLoansToTable = async (
  processedLoans,
  lastBlock,
) => {
  const itemsWithBlock = processedLoans.map(item => ({
    ...item,
    updateBlock: lastBlock,
  }));

  log.info({
    message: `Saving ${itemsWithBlock.length} Maker loan records to db.`,
  });

  await MakerTableData.insertMany(itemsWithBlock);
};

export const updateCurrentLastBlock = async (lastBlock) => {
  const timestampObjArr = await MakerDataCurrentTimestamp.find();
  if (!timestampObjArr.length) {
    const newTimestampObj = {
      currentBlock: lastBlock,
      name: lastBlockRecordName,
    };
    await MakerDataCurrentTimestamp.insertOne(newTimestampObj);
  } else {
    await MakerDataCurrentTimestamp.updateOne({
      name: lastBlockRecordName,
    }, {
      $set: { currentBlock: lastBlock },
    });
  }
};

export const fullHashToTable = async (fullHash, lastBlock) => {
  const tokens = await getCacheAllTokens();
  const processedLoans = await calculateHashParams(fullHash, tokens);
  return writeLoansToTable(processedLoans, lastBlock);
};
