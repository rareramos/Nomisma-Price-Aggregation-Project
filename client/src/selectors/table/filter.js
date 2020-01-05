import {
  selectTableFromState,
  selectTableSwitcherTabsSelector,
} from './base';

export const selectTableFilter = (state) => selectTableFromState(state).filter;

export const selectTableTabIndex = (state) => {
  const { tab } = selectTableFilter(state);
  const tabs = selectTableSwitcherTabsSelector();
  return tabs.findIndex(t => t.value === tab);
};

export const selectTablePage = (state) => selectTableFilter(state).page;

export const selectTableToken = (state) => selectTableFilter(state).token;
