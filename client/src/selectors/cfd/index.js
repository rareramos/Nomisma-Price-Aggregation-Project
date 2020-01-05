import {
  mockCfdData,
  cvaSettingItems,
  currencyPairsItems,
  brokersCreditCVAItems,
  sortFuturesContractItems,
} from '../../utils/cfd';
import { onFormChange } from '../../actions/cfd';
import { store } from '../../store/configure-store';

export * from './ui';

export const selectCfdFromState = state => state.cfd;

export const selectCfdMockData = () => mockCfdData;

export const selectFormDataFromState = state => selectCfdFromState(state).formData;

export const selectCfdColumnsFromState = (state) => {
  const cfdColumnsData = selectFormDataFromState(state).columnsData;
  if (selectFormDataFromState(state).brokersCreditCVA === 'Credit Grade') {
    cfdColumnsData.forEach((data) => {
      if (data.columnName === 'Credit Grade' || data.columnName === 'Implied PD') {
        data.enabled = true;
      } else if (data.columnName === 'Enter PD') {
        data.enabled = false;
      }
    });
  } else if (selectFormDataFromState(state).brokersCreditCVA === 'Probability Of Default') {
    cfdColumnsData.forEach((data) => {
      if (data.columnName === 'Credit Grade' || data.columnName === 'Implied PD') {
        data.enabled = false;
      } else if (data.columnName === 'Enter PD') {
        data.enabled = true;
      }
    });
  } else if (selectFormDataFromState(state).brokersCreditCVA === 'Credit Spreads (Tailored Setting)') {
    cfdColumnsData.forEach((data) => {
      if (
        data.columnName === 'Credit Grade'
        || data.columnName === 'Implied PD'
        || data.columnName === 'Enter PD'
      ) {
        data.enabled = false;
      }
    });
  }
  return cfdColumnsData.filter(column => column.enabled === true);
};

export const selectCvaFvaItems = () => cvaSettingItems.map(({ abbrKey, value }) => ({
  item: {
    abbrKey,
    value,
  },
  key: value,
  onSelectChange: () => store.dispatch(onFormChange({ cvaFva: value })),
}));

export const selectCurrencyPairsItems = () => currencyPairsItems;

export const selectBrokersCreditCVAItems = () => brokersCreditCVAItems;

export const selectAvailableMarkers = state => selectCfdFromState(state).availableMarkets;

export const selectQuasiLive = state => selectCfdFromState(state).quasiLive;

export const selectCurrencyPairsItemsFromState = (state) => {
  const availableMarkets = selectAvailableMarkers(state);
  return availableMarkets.map(pair => ({
    item: {
      abbrKey: pair,
      value: pair,
    },
    key: pair,
    onSelectChange: () => store.dispatch(onFormChange({ currencyPairs: pair })),
  }));
};

export const selectCfdFormDataFromState = state => selectCfdFromState(state).formData;

export const selectFutureContractItemsFromState = (state) => {
  const formDataCurrencyPair = selectCfdFormDataFromState(state).currencyPairs;
  const quasiLive = selectQuasiLive(state);
  const futuresContractItems = [];
  const regEx = /(Perpetual)|19+/g;

  if (quasiLive) {
    // eslint-disable-next-line array-callback-return
    Object.keys(quasiLive).map((key) => {
      let trimmedKey = '';
      if (key.match(regEx) && key.slice(0, 7) === formDataCurrencyPair) {
        if (key.length === 19) {
          trimmedKey = key.slice(-9);
        } else if (key.length < 19) {
          trimmedKey = key.slice(-5);
        }
        futuresContractItems.push({
          item: {
            abbrKey: trimmedKey,
            value: trimmedKey,
          },
          key: trimmedKey,
          onSelectChange: () => store.dispatch(onFormChange({ futureContract: trimmedKey })),
        });
      }
    });
    return sortFuturesContractItems(futuresContractItems);
  }
  return [{
    item: {
      abbrKey: 'Perpetual',
      value: 'Perpetual',
    },
    key: 'Perpetual',
    onSelectChange: () => store.dispatch(onFormChange({ futureContract: 'Perpetual' })),
  }];
};

export const selectFutureContractFromState = (state) => {
  const formDataFutureContract = selectCfdFormDataFromState(state).futureContract || 'Perpetual';
  return formDataFutureContract;
  /*
  if (selectFutureContractItems(state)[0]) {
    return selectFutureContractItems(state)[0].abbrKey;
  }
  return 'Perpetual';
  */
};

const computeValuationAdjustments = (state, data) => {
  const settings = selectCfdFormDataFromState(state);
  let toReturn = {};
  if (settings.cvaFva === 'Default') {
    Object.keys(data).forEach((key) => {
      const {
        bid,
        offer,
        epe = 1,
        margin = 1,
        pd = 1,
        t = 1,
        recov = 1,
        rLoan = 1,
        funding = 1,
        // fundingLong = 1,
        // fundingShort = 1,
        tFee = 1,
      } = data[key];
      const computedData = { ...data[key] };

      // CVA formula
      computedData.cva = -1 * ((Number(bid) + Number(offer)) / (2 * (Number(epe) + Number(margin)))
        * Number(pd) * Number(t) * (1 - Number(recov)));

      // FVA formula
      computedData.fva = -1 * ((Number(bid) + Number(offer)) / (2 * (Number(margin)
        * (Math.exp((Number(rLoan) * Number(t)) - 1)))));

      // Carry formula
      computedData.carry = ((Number(bid) + Number(offer)) / (2 * Number(funding)));

      // TradingFee formula
      computedData.tradingFee = ((Number(bid) + Number(offer))
        / (2 * Number(tFee) * (Math.exp(Number(rLoan * Number(t))))));

      toReturn[key] = computedData;
    });
  } else {
    // TODO: implement calculation for Tailored settings
    toReturn = { ...data };
  }
  return toReturn;
};

export const selectCfdMarketData = state => selectCfdFromState(state).marketData;

export const selectCfdQuasiLiveData = state => selectCfdFromState(state).quasiLive;

const selectCfdMergedData = (liveData, quasiLiveData) => {
  const toReturn = {};
  Object.keys(liveData).forEach((key) => {
    const { symbol = '' } = liveData[key];
    let quasiLiveDataForCurrency = {};
    if (quasiLiveData[symbol]) {
      if (quasiLiveData[symbol][key]) {
        // eslint-disable-next-line prefer-destructuring
        quasiLiveDataForCurrency = quasiLiveData[symbol][key][0];
      }
    }
    toReturn[key] = {
      ...quasiLiveDataForCurrency,
      ...liveData[key],
    };
  });
  return toReturn;
};

export const selectCfdDisplayTableRecordsFromState = (state) => {
  let data = selectCfdMergedData(selectCfdMarketData(state), selectCfdQuasiLiveData(state));
  const keyNames = Object.keys(data);
  let toReturn;
  if (data && keyNames.length) {
    data = computeValuationAdjustments(state, data);
    const columns = selectCfdColumnsFromState(state);
    toReturn = keyNames.map(item => columns.reduce((acc, column) => {
      let propValue;
      if (column.key === 'platform') {
        data[item][column.key] = item;
      }
      if (data[item][column.key] === undefined || data[item][column.key] === null) {
        propValue = '-';
        if (column.key === 'pd') {
          propValue = column.selector(1);
        }
      } else if (column.selector) {
        propValue = column.selector(data[item]);
      } else if (column.render) {
        propValue = column.render(data[item]);
      } else {
        propValue = data[item][column.key];
      }
      return {
        ...acc,
        [column.key]: propValue,
      };
    }, {}));
  } else {
    toReturn = [];
  }
  return toReturn;
};

export const selectCfdHeaderFromState = (state) => {
  const columns = selectCfdColumnsFromState(state);
  return columns.map(column => column.columnName);
};

export const selectCfdKeyFromState = (state) => {
  const columns = selectCfdColumnsFromState(state);
  return columns.map(column => column.key);
};

export const selectCfdBodyFromState = (state) => {
  const columns = selectCfdColumnsFromState(state);
  const tableData = selectCfdDisplayTableRecordsFromState(state);
  const result = tableData.length > 0 ? tableData.map(data => columns.map((column) => {
    if (column.enabled && column.selector) {
      return column.selector(data);
    }
    return [];
  })) : [];
  return result;
};

export const selectUniqueProvidersFromState = (state) => {
  const quasiLive = selectCfdQuasiLiveData(state);
  const uniqueProviderKeys = [];
  Object.keys(quasiLive)
    .map(key => Object.keys(quasiLive[key])
      .map(providerKey => uniqueProviderKeys.push(providerKey)));
  return uniqueProviderKeys.filter((item, index, self) => self.indexOf(item) === index);
};
