import { put, takeEvery, select } from 'redux-saga/effects';
import { CHART_SOURCE_UPDATE } from '../../actions/types';
import { selectPeriodFromState } from '../../selectors/chart/index';
import {
  fetchChartData,
  saveChartSource,
  fetchChartError,
  updateChartCompare,
  fetchChartDataSecondarySuccess,
} from '../../actions/chart';

function* chartSurce({ data }) {
  try {
    const period = yield select(selectPeriodFromState);
    yield put(fetchChartData(data, period));
    if (data !== 'all') {
      yield put(updateChartCompare(false));
      yield put(fetchChartDataSecondarySuccess([]));
    }
    yield put(saveChartSource(data));
  } catch (e) {
    yield put(fetchChartError(e));
  }
}

export function* chartSourceSaga() {
  yield takeEvery(CHART_SOURCE_UPDATE, chartSurce);
}
