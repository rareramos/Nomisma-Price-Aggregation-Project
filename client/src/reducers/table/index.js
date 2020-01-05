import { combineReducers } from 'redux';
import data from './data';
import loading from './loading';
import meta from './meta';
import filter from './filter';

const tableReducer = combineReducers({
  loading,
  data,
  meta,
  filter,
});

export default tableReducer;
