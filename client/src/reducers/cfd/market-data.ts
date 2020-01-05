import { types } from 'actions/types';
import { ApplicationAction } from 'types/actions';
import { IMarketsDataState } from 'types/reducers/cfd';
import { getDeepCopiedMarkets } from './common';

const initialMarketsDataState : IMarketsDataState = {};

export const marketData = (
  state : IMarketsDataState = initialMarketsDataState,
  action : ApplicationAction,
) : IMarketsDataState => {
  switch (action.type) {
    case types.ADD_BULK_MARKET_DATA:
      return action.data;
    case types.MARKET_DATA_ALL:
      return { ...state, ...action.data };
    case types.MARKET_DATA_UPDATED:
      if (action.data) {
        let update = state;
        // eslint-disable-next-line no-restricted-syntax
        for (const payload of action.data) {
          update = {
            ...update,
            ...getDeepCopiedMarkets(update, payload),
          };
        }
        return {
          ...state,
          ...update,
        };
      }
      return state;
    default:
      return state;
  }
};
