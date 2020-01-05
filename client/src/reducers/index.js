import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import { AccountReducer as account } from './account';
import user from './account/user_reducer';
import table from './table';
import chart from './chart';
import loans from './loans';

const rootReducer = combineReducers({
  account,
  table,
  form,
  user,
  chart,
  loans,
});

export default rootReducer;
