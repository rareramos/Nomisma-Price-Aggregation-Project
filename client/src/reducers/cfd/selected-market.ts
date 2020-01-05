import { types } from 'actions/types';
import { ApplicationAction } from 'types/actions';

export const availableMarkets = (
  state : string = null,
  action : ApplicationAction,
) : string => {
  switch (action.type) {
    case types.MARKET_SELECTED:
      return action.data;
    default:
      return state;
  }
};
