import * as types from '../../actions/types';

const initialState = 0;

const meta = (state = initialState, action) => {
  switch (action.type) {
    case types.TABLE_SAVE:
      return action.data.meta;
    default:
      return state;
  }
};

export default meta;
