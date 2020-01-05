import { createCollection } from './abstract';

let modelsConfig = null;

export const getCurrentRunnerModelConfig = () => modelsConfig;

export const setCurrentRunnerModelsConfig = (eventsConfig) => {
  modelsConfig = Object.entries(eventsConfig)
    .reduce(
      (
        acc,
        [
          evtName,
          collectionName,
        ],
      ) => ({
        ...acc,
        [evtName]: createCollection(collectionName),
      }), {},
    );
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

// Tables for CFD
// contains quasi-live data (funding rate, margin, trading fee etc) from brokers
export const CfdSettings = createCollection('cfd-settings');
export const CfdExpiryDatesMappingData = createCollection('cfd-expiry-dates-mapping-data');
export const CfdInterestRatesFundingOfferData = createCollection('cfd-interest_rates_funding_offer-data');
export const CfdFundingOfferTailoredData = createCollection('cfd-funding-offer-tailored-data');
export const CfdCrossCurrencyBasisData = createCollection('cfd-cross-currency-basis-data');
export const CfdDefaultRecoveryUponData = createCollection('cfd-default-recovery-upon-data');
export const CfdRequiredInitialMarginData = createCollection('cfd-required-initial-margin-data');
export const CfdRequiredMarginData = createCollection('cfd-required-margin-data');
export const CfdMappingSymbolsData = createCollection('cfd-mapping-symbols-data');
export const CfdQuasiLiveData = createCollection('cfd-quasi-live-data');
export const CfdScrapingData = createCollection('cfd-scraping-data');
export const CfdUnmatchedSymbolsData = createCollection('cfd-unmatched-symbols-data');
