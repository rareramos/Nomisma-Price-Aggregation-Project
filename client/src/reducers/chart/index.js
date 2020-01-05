import { combineReducers } from 'redux';
import data from './data';
import dataSecondary from './data-secondary';
import loading from './loading';
import period from './period';
import source from './source';
import currency from './currency';
import compare from './compare';

const chartReducer = combineReducers({
  loading,
  period,
  source,
  data,
  currency,
  compare,
  dataSecondary,
});

export default chartReducer;
