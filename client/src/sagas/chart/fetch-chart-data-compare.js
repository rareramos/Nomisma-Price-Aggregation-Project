import { put, takeEvery, call, select } from 'redux-saga/effects';
import { CHART_SECONDARY_FETCH } from '../../actions/types';
import { selectPeriodFromState, selectChartComapreFromState } from '../../selectors/chart';
import {
  fetchChartError,
  toggleChartLoading,
  fetchChartDataSecondarySuccess,
  fetchChartData,
} from '../../actions/chart';
import { fetchChart } from '../../api/chart';

function* fetchDataCompare() {
  try {
    const isInCompareMode = yield select(selectChartComapreFromState);
    if (isInCompareMode) {
      yield put(toggleChartLoading());
      const range = yield select(selectPeriodFromState);
      const response = yield call(fetchChart, {
        protocol: 'dharma',
        chartLengthSeconds: range,
      });
      yield put(fetchChartDataSecondarySuccess(response));
      yield put(fetchChartData('compound', range));
      yield put(toggleChartLoading());
    } else {
      yield put(fetchChartDataSecondarySuccess([]));
    }
  } catch (e) {
    yield put(fetchChartError(e));
    yield put(toggleChartLoading());
  }
}

export function* chartFetchSecondarySaga() {
  yield takeEvery(CHART_SECONDARY_FETCH, fetchDataCompare);
}
