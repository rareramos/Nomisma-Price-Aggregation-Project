import { combineReducers } from 'redux';

import tokens from './tokens';

const loansReducer = combineReducers({
  tokens,
});

export default loansReducer;
