import {
  cfdInitialMarginColumns,
} from '../../utils/cfd';
import {
  selectCfdQuasiLiveData,
} from '.';

const selectCfdUIFromState = state => state.ui.cfd;

export const selectShowTailoredSettings = state => selectCfdUIFromState(state).showTailoredSettings;

export const selectShowCFDModalFromState = state => selectCfdUIFromState(state).showCFDModal;

export const selectCfdInitialMarginTableHeader = () => cfdInitialMarginColumns.map(
  column => column.columnName,
);

export const selectCfdInitialMarginTableKey = () => cfdInitialMarginColumns.map(
  column => column.key,
);

export const selectCfdInitialMarginTableBodyFromState = (state) => {
  const columns = cfdInitialMarginColumns;
  const tableData = selectCfdQuasiLiveData(state);
  const providers = [];
  Object.keys(tableData).forEach((currencyKey) => {
    Object.keys(tableData[currencyKey]).forEach((providerKey) => {
      providers.push(providerKey);
    });
  });
  const uniqueProviders = providers.filter((val, index, self) => self.indexOf(val) === index);
  const result = uniqueProviders.map(provider => columns.map((column) => {
    if (column.enabled && column.key === 'margin') {
      return 2;
    }
    if (column.enabled && column.selector) {
      return column.selector(provider);
    }
    return null;
  }));
  return result;
};

export const selectCFDModalData = () => {
  const modals = [
    {
      title: 'Request Initial Margin',
      render: () => null,
    },
    {
      title: 'Initial on Margin',
      render: () => null,
    },
    {
      title: 'You own Funding Offer',
      render: () => null,
    },
  ];
  return modals;
};

export const selectSelectedTabCFDModalFromState = state => selectCfdUIFromState(state).selectedTabCFDModal;
