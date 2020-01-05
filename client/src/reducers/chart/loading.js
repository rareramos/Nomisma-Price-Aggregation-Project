import * as types from '../../actions/types';

const initialState = false;

export const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHART_LOADING_TOGGLE:
      return !state;
    default:
      return state;
  }
};
