import { selectTableFromState } from './index';

export const selectTotalItemsFromState = state => selectTableFromState(state).meta;

export const selectTablePageCountSelector = (state) => {
  const totalItems = selectTotalItemsFromState(state);
  return Math.ceil(totalItems / 15);
};
