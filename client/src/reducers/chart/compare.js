import * as types from '../../actions/types';

const initialState = false;

export const compareReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHART_COMPARE_SAVE:
      return action.data;
    default:
      return state;
  }
};
