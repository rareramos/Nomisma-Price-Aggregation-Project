import { combineReducers } from 'redux';
import { tokensReducer as tokens } from './tokens';

export const loansReducer = combineReducers({
  tokens,
});
