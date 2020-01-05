import { createCollection } from './abstract';

let modelsConfig = null;

export const getCurrentRunnerModelConfig = () => modelsConfig;

export const setCurrentRunnerModelsConfig = eventsConfig => {
  modelsConfig = Object.entries(eventsConfig)
    .reduce(
      (
        acc,
        [
          evtName,
          collectionName,
        ]
      ) => ({
        ...acc,
        [evtName]: createCollection(collectionName),
      }), {});
};

export const CMCConvertResult = createCollection('cmc-convert-result');

export const BlockTimestamp = createCollection('block-timestamp');
export const CompoundBalances = createCollection('compound-borrow-balances');
export const CompoundTableData = createCollection('compound-table-data');
// this holds singleton timestamp of last valid compound
// table data points
export const CompoundDataCurrentTimestamp = createCollection('compound-table-data-timestamp');

export const DharmaDebtKernelOrderFilledTransactions = createCollection('dharma-debt-kernel-order-filled-transactions');
export const DharmaTermsContractRepayParams = createCollection('dharma-terms-contract-repay-params');
export const DharmaTableData = createCollection('dharma-table-data');
// this holds singleton timestamp of last valid compound
// table data points
export const DharmaDataCurrentTimestamp = createCollection('dharma-table-data-timestamp');

export const MakerOutstandingBalances = createCollection('maker-outstanding-balances');
export const MakerWipeGovTransfers = createCollection('maker-wipe-gov-transfers');
export const MakerOutstandingFees = createCollection('maker-outstanding-fees');
export const MakerTableData = createCollection('maker-table-data');
// this holds singleton timestamp of last valid compound
// table data points
export const MakerDataCurrentTimestamp = createCollection('maker-table-data-timestamp');

export const LoansTable = createCollection('loans-table');
export const LoansTableTimestamp = createCollection('loans-table-timestamp');
