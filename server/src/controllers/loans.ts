import {
  LoansTable,
  LoansTableTimestamp,
  BlockTimestamp,
} from 'price-aggregation-db';

import { selectLoanBinsWithEmptyRecords } from '../selectors/loan-selectors';
import {
  ILoansData, ILoanTokens, IPlatformFilters, IPlatform, IGetLoan, ILoanSelector, ILoanVolumes,
} from '../types';

const platformFilters : IPlatformFilters = {
  compound: 'Compound Finance',
  dharma: 'Dharma',
  maker: 'Maker',
};

const dayInSeconds = 60 * 60 * 24;

export const getLoans = async ({
  offset = 0,
  limit = 15,
  token = 'all',
  sort = 'loanTimestamp',
  order = '-1',
  platform = 'all',
} : IGetLoan) : Promise<ILoansData | Array<string>> => {
  let toReturn : ILoansData | Array<string>;
  const lastTimestampObjArr = await LoansTableTimestamp.find();
  if (!lastTimestampObjArr.length) {
    toReturn = [];
  } else {
    const hasPlatformFilter = platform !== 'all';
    const defaultMatchParams = {
      updateBlock: lastTimestampObjArr[0].currentBlock,
    };
    const matchParams : IPlatform = token === 'all'
      ? defaultMatchParams
      : {
        ...defaultMatchParams,
        loanSymbol: token,
      };
    if (hasPlatformFilter) {
      matchParams.platform = platformFilters[platform];
    }
    const cursor = await LoansTable.aggregate(
      [
        {
          $match: matchParams,
        },
        {
          $sort: { [sort]: parseInt(order, 10) },
        },
        {
          $project: { _id: 0, updateBlock: 0 },
        },
        {
          $facet: {
            paginatedResults: [
              {
                $skip: offset,
              },
              {
                $limit: limit,
              },
            ],
            total: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ],
      {
        allowDiskUse: true,
      },
    );
    const fullResponse = await cursor.next();
    toReturn = {
      items: fullResponse.paginatedResults,
      meta: fullResponse.total[0].count,
    };
  }
  return toReturn;
};

export const getLoanTokens = async () : Promise<ILoanTokens> => {
  const tokens = await LoansTable.distinct('loanSymbol');
  return {
    tokens,
  };
};

export const supportedBins = {
  [`${dayInSeconds}`]: 24,
  [`${dayInSeconds * 7}`]: 14,
  [`${dayInSeconds * 30}`]: 30,
  [`${dayInSeconds * 30 * 6}`]: 6,
};

/**
 * Returns chart datapoints with amount of loans and
 * respective accumulated principalUsd values. We split
 * existing loans on to buckets here and calculate total amount
 * in USD terms. This chart works based on one of the available
 * configurations from `supportedBins` variable
 * @param chartLengthInSeconds
 * @param platform
 * @returns {Promise<Array>}
 */
export const getLoanVolumeBinDataPoints = async ({
  chartLengthInSeconds = dayInSeconds * 30,
  platform = 'all',
}) : Promise<Array<ILoanVolumes> | []> => {
  let toReturn;
  const lastTimestampObjArr = await LoansTableTimestamp.find();
  if (!lastTimestampObjArr.length) {
    toReturn = [];
  } else {
    const hasPlatformFilter = platform !== 'all';
    const matchParams : IPlatform = { updateBlock: lastTimestampObjArr[0].currentBlock };
    if (hasPlatformFilter) {
      matchParams.platform = platformFilters[platform];
    }
    const lastBlock = lastTimestampObjArr[0].currentBlock;
    const blockTimestampArr = await BlockTimestamp.find({
      blockNumber: lastBlock,
    });
    const lastTimestamp = blockTimestampArr[0].timestamp;
    const boundariesAmt = supportedBins[`${chartLengthInSeconds}`];
    const startTime = lastTimestamp - chartLengthInSeconds;
    matchParams.loanTimestamp = {
      $gt: startTime,
    };
    // for n buckets there are n + 1 boundaries
    // our last boundary is always last timestamp
    // if we ignore last timestamp we will have issues
    // with records falling into error bucket because of
    // flooring of durationPerBucket.
    const durationPerBucket = Math.floor(
      chartLengthInSeconds / (boundariesAmt - 1),
    );
    const boundaries : Array<number> = new Array(boundariesAmt - 1)
      .fill(0)
      .map(
        (
          _ : string,
          idx : number,
        ) : number => startTime + (idx * durationPerBucket),
      );
    boundaries.push(lastTimestamp);
    const cursor = await LoansTable.aggregate([
      {
        $match: matchParams,
      },
      {
        $bucket: {
          groupBy: '$loanTimestamp',
          boundaries,
          output: {
            count: { $sum: 1 },
            amounts: {
              $push: '$principalUsd',
            },
          },
        },
      },
    ]);
    let fullResponse = await cursor.toArray();
    fullResponse = selectLoanBinsWithEmptyRecords(fullResponse, boundaries);
    toReturn = fullResponse.map(
      (
        {
          _id,
          count,
          amounts,
        } : ILoanSelector,
      ) => ({
        timestamp: _id,
        loansAmount: count,
        totalValueUsd: amounts.reduce(
          (
            totalAcc : number,
            amount : string,
          ) : number => totalAcc + parseFloat(amount), 0,
        ),
      }),
    );
  }
  return toReturn;
};
