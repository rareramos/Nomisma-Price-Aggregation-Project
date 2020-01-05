import { ApplicationAction } from 'types/actions';
import { types } from 'actions/types';
import { IQuasiLiveState } from 'types/reducers/cfd';
import {
  getDeepCopiedMarkets,
} from './common';

export const quasiLiveReducer = (
  state : IQuasiLiveState = {},
  action : ApplicationAction,
) : IQuasiLiveState => {
  switch (action.type) {
    case types.CFD_QUASILIVE_SAVE:
      if (action.data) {
        return {
          ...state,
          ...getDeepCopiedMarkets(state, action.data),
        };
      }
      return state;
    default:
      return state;
  }
};
