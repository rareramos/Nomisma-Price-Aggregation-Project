import { types } from 'actions/types';
import { ApplicationAction } from 'types/actions';

export const initialStateAvailableMarkets : Array<string> = [];

export const availableMarkets = (
  state : Array<string> = initialStateAvailableMarkets,
  action : ApplicationAction,
) : Array<string> => {
  switch (action.type) {
    case types.ADD_AVAILABLE_MARKETS:
      return action.data;
    default:
      return state;
  }
};
