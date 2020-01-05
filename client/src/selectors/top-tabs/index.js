import { topTabs } from '../../utils/top-tabs';

export const selectTopTabsSelector = () => topTabs;

export const selectTopTab = state => state.topTab;

export const selectTopTabIndex = (state) => {
  const tab = selectTopTab(state);
  const tabs = selectTopTabsSelector();
  return tabs.findIndex(t => t.value === tab);
};
