import * as types from '../../actions/types';
import { defaultPeriodValue } from '../../utils/chart';

const initialState = defaultPeriodValue;

export const periodReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHART_PERIOD_SAVE:
      return action.data;
    default:
      return state;
  }
};
