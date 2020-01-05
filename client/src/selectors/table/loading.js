import { selectTableFromState } from './index';

export const selectTableLoadingSelector = state => selectTableFromState(state).loading;
