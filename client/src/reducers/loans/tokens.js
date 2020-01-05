import * as types from '../../actions/types';

const initialState = [];

export const tokensReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_LOAN_TOKENS_SUCCESS:
      return action.data.tokens;
    default:
      return state;
  }
};
