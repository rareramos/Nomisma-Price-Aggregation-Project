import { call, fork, select, takeLatest } from 'redux-saga/effects';
import {
  TABLE_SOURCE_UPDATE,
  TABLE_PAGE_UPDATE,
  TABLE_TOKEN_UPDATE,
  TABLE_SORT_BY,
  TABLE_UPDATE_FILTER,
} from '../../actions/types';
import { selectTableFilter } from '../../selectors/table';
import { fetchTableData } from './fetch-table-data';
import {
  handleSourceChange,
  handlePageChange,
  handleTokenChange,
  handleSortBy,
} from './filter';


function* fetchInitialTableData() {
  const filter = yield select(selectTableFilter);
  yield call(fetchTableData, { data: filter });
}

export function* tableSaga() {
  yield takeLatest(TABLE_SOURCE_UPDATE, handleSourceChange);
  yield takeLatest(TABLE_PAGE_UPDATE, handlePageChange);
  yield takeLatest(TABLE_TOKEN_UPDATE, handleTokenChange);
  yield takeLatest(TABLE_SORT_BY, handleSortBy);

  yield takeLatest(TABLE_UPDATE_FILTER, fetchTableData);

  yield fork(fetchInitialTableData);
}
