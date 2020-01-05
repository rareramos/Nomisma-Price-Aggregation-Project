import { combineReducers } from 'redux';
import { dataReducer as data } from './data';
import { dataSecondaryReducer as dataSecondary } from './data-secondary';
import { loadingReducer as loading } from './loading';
import { periodReducer as period } from './period';
import { sourceReducer as source } from './source';
import { currencyReducer as currency } from './currency';
import { compareReducer as compare } from './compare';

export const chartReducer = combineReducers({
  loading,
  period,
  source,
  data,
  currency,
  compare,
  dataSecondary,
});
