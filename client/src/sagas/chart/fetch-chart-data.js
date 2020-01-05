import { put, takeEvery, call } from 'redux-saga/effects';
import { CHART_FETCH } from '../../actions/types';
import {
  fetchChartSuccess,
  toggleChartLoading,
  fetchChartError,
} from '../../actions/chart';
import { fetchChart } from '../../api/chart';

function* fetchChartData({ data: { protocol, value } }) {
  try {
    yield put(toggleChartLoading());
    const response = yield call(fetchChart, {
      protocol,
      chartLengthSeconds: value,
    });
    yield put(fetchChartSuccess(response));
    yield put(toggleChartLoading());
  } catch (err) {
    // const message = 'Server Error, try later.';
    yield put(fetchChartError(err));
    yield put(toggleChartLoading());
  }
}

export function* fetchChartSaga() {
  yield takeEvery(CHART_FETCH, fetchChartData);
}
