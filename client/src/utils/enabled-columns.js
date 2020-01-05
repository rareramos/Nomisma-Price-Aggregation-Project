import { LoadableTokenIcon } from '../components/common/loadable-token-icon';
import { ViewCell } from '../components/table/view-cell';

const commonColumns = [
  {
    columnName: 'Loan Time',
    key: 'loanFromNow',
    selector: (item) => {
      const currentTime = new Date().getTime();
      const loanTime = new Date(item.loanTimestamp * 1000);
      let timeId = Math.ceil((currentTime - loanTime) / 1000 / 60);
      if (timeId < 60) {
        timeId += ' minutes ago';
      } else if (timeId < 24 * 60) {
        timeId = `${Math.ceil(timeId / 60)} hours ago`;
      } else if (timeId < 24 * 60 * 30) {
        timeId = `${Math.ceil(timeId / 60 / 24)} days ago`;
      } else if (timeId < 24 * 60 * 30 * 12) {
        timeId = `${Math.ceil(timeId / 60 / 24 / 30)} months ago`;
      } else if (timeId < 24 * 60 * 30 * 12 * 100) {
        timeId = `${Math.ceil(timeId / 60 / 24 / 30 / 12)} years ago`;
      }
      return timeId;
    },
  },
  {
    columnName: 'Token',
    key: 'currencyIcon',
    render: ({ loanSymbol }) => LoadableTokenIcon({ symbol: loanSymbol }),
  },
  {
    columnName: 'Loan Amount',
    key: 'loanAmount',
    selector: (item) => {
      // Loan Amount = {element.principal} {element.tokenSymbol} (${element.principalUsd})
      const loanDollar = (parseFloat(item.principalUsd)).toFixed(4);
      const loanCrypto = (parseFloat(item.principal)).toFixed(4);
      const tokenSymbol = item.loanSymbol;
      return `${loanCrypto} ${tokenSymbol} ($ ${loanDollar} )`;
    },
  },
  {
    columnName: 'APR',
    key: 'apr',
    selector: item => `${item.apr} %`,
  },
  {
    columnName: 'Loan Term',
    key: 'loanTerm',
  },
  {
    columnName: 'Collateral ratio',
    key: 'ccr',
    selector: item => `${item.ccr} %`,
  },
  {
    columnName: 'Loan Status',
    key: 'loanStatus',
  },
  {
    columnName: 'Repaid',
    key: 'repaidPercentage',
    selector: item => `${item.repaidPercentage} %`,
  },
  {
    columnName: 'Protocol',
    key: 'platform',
  },
  {
    columnName: 'View',
    render: ({ transactionHash }) => ViewCell({ transactionHash }),
  },
];

export const getEnabledColumns = () => {
  let enabledColumns;
  if (USE_OWN_API) {
    enabledColumns = commonColumns;
  } else {
    enabledColumns = [
      ...commonColumns,
      {
        columnName: 'Collateral Liquidation Risk',
        key: 'collateralLiquidationRisk',
      },
    ];
  }
  return enabledColumns;
};
