import * as types from '../../actions/types';

const initialState = [];

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHART_SAVE:
      return action.data;
    default:
      return state;
  }
};

export default dataReducer;
