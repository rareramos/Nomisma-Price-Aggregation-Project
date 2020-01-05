import { selectTableFromState } from './index';

export const selectTotalItemsFromState = state => selectTableFromState(state).meta;

export const selectTablePageCountSelector = state => Math.ceil(selectTotalItemsFromState(state) / 15);
