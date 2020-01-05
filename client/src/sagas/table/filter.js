import { put, select } from 'redux-saga/effects';

import { selectTableFilter } from '../../selectors/table';
import { updateTableFilter } from '../../actions/table';

export function* handleSourceChange({data}) {
  const filter = yield select(selectTableFilter);
  yield put(updateTableFilter({
    ...filter,
    tab: data,
  }));
}

export function* handlePageChange({data}) {
  const filter = yield select(selectTableFilter);
  yield put(updateTableFilter({
    ...filter,
    page: data,
  }));
}

export function* handleTokenChange({data}) {
  const filter = yield select(selectTableFilter);
  yield put(updateTableFilter({
    ...filter,
    token: data,
  }));
}

export function* handleSortBy({data}) {
  const filter = yield select(selectTableFilter);
  let sort = data;
  let order = 1;

  // If the column is already sorted, set the order to the next state.
  //   1: ascending
  //   -1: descending
  //   null: no sorting
  if (filter.sort === data) {
    if (filter.order === 1) {
      order = -1;
    } else if (filter.order === -1) {
      sort = null;
      order = null;
    }
  }
  yield put(updateTableFilter({
    ...filter,
    sort,
    order,
  }));
}
