import moment from 'moment';

const parseLoanTerm = item => {
  // Loan Term
  let loanTerm = item.loanTerm + ':';
  loanTerm = loanTerm.split(':');
  if (loanTerm[ 0 ] === '00') {
    loanTerm[ 0 ] = 'open-ended';
  } else {
    loanTerm[ 0 ] = loanTerm[ 0 ] + ' days';
  }
  return loanTerm[0];
};

const parseCcr = item => `${Math.round((item.collateralTokens[ 0 ].usdAmount / item.totalAmount) * 100)}`;

export const serialiseLoanScanResponse = payload => ({
  meta: payload.totalCount,
  items: payload.dataSlice.map(item => ({
    loanTimestamp: Math.floor(new Date(item.creationTime).getTime() / 1000),
    apr: (item.annualizedRate * 100).toFixed(2),
    loanSymbol: item.tokenSymbol,
    principal: item.principal,
    principalUsd: item.principalUsd,
    loanTerm: parseLoanTerm(item),
    ccr: parseCcr(item),
    loanStatus: item.status,
    collateralLiquidationRisk: 'High',
    repaidPercentage: `${Math.round((item.cumulativeRepaid / item.totalAmount) * 100)}`,
    platform: item.loanProtocol,
  })),
});

const parseOwnLoanTerm = loanTermInSeconds => {
  let toReturn;
  if (!loanTermInSeconds) {
    toReturn = 'open-ended';
  } else {
    toReturn = moment.duration(loanTermInSeconds, 'seconds').humanize();
  }
  return toReturn;
};

export const serialiseOwnResponse = payload => ({
  meta: payload.meta,
  items: payload.items.map(item => ({
    ...item,
    loanStatus: parseFloat(item.repaidPercentage) === 100 ? 'Repaid' : 'Current',
    loanTerm: parseOwnLoanTerm(item.loanTermSeconds),
    ccr: !!item.ccr ? item.ccr : 'N/A',
    repaidPercentage: !!item.repaidPercentage ? item.repaidPercentage : '0',
    transactionHash: item.transactionHash,
  })),
});
