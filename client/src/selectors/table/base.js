import { getTabs } from '../../utils/tabs';

export const selectTableFromState = state => state.table;

export const selectTableSwitcherTabsSelector = () => getTabs();
