import { selectChartFromState } from './index';

export const selectChartLoadingSelector = state => selectChartFromState(state).loading;
