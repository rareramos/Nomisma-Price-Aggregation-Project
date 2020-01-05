import { types } from 'actions/types';
import { ApplicationAction } from 'types/actions';
import { TMarketUpdateParameterState } from 'types/reducers/cfd';

export const marketUpdateParametersState = {};

export const marketUpdateParameters = (
  state : TMarketUpdateParameterState = marketUpdateParametersState,
  action : ApplicationAction,
) : TMarketUpdateParameterState => {
  switch (action.type) {
    case types.MARKET_UPDATE_PARAMETERS:
      return null;
    default:
      return state;
  }
};
