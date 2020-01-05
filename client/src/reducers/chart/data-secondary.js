import * as types from '../../actions/types';

const initialState = [];

export const dataSecondaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHART_SECONDARY_SAVE:
      return action.data;
    default:
      return state;
  }
};
