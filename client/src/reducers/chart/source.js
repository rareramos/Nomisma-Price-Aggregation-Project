import * as types from '../../actions/types';
import { defaultSourceValue } from '../../utils/chart';

const initialState = defaultSourceValue;

export const sourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHART_SOURCE_SAVE:
      return action.data;
    default:
      return state;
  }
};
