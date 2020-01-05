import { put, call } from 'redux-saga/effects';
import {
  fetchTableSuccess,
  toggleTableLoading,
  fetchTableError,
} from '../../actions/table';
import { fetchLoanscanTable, fetchOwnTable } from '../../api/table';
import { serialiseLoanScanResponse, serialiseOwnResponse } from '../../serialisers/table';

export function* fetchTableData({
  data: {
    tab: protocol,
    page,
    token,
    sort,
    order,
  },
}) {
  try {
    yield put(toggleTableLoading());
    let parsedResponse;
    if (USE_OWN_API) {
      const response = yield call(fetchOwnTable, {
        protocol,
        token,
        currentPage: page,
        perPage: 15,
        sort,
        order,
      });
      parsedResponse = serialiseOwnResponse(response);
    } else {
      const response = yield call(fetchLoanscanTable, {
        protocol,
        currentPage: page,
        perPage: 15,
      });
      parsedResponse = serialiseLoanScanResponse(response);
    }

    yield put(fetchTableSuccess(parsedResponse));
    yield put(toggleTableLoading());
  } catch (err) {
    const message = 'Server Error, try later.';
    yield put(fetchTableError(message));
    yield put(toggleTableLoading());
  }
}
