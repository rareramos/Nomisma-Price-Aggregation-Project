import * as types from '../../actions/types';

const initialState = [];

const activeTabReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TABLE_SAVE:
      return action.data.items;
    default:
      return state;
  }
};

export default activeTabReducer;
