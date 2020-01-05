import { put, takeEvery } from 'redux-saga/effects';
import { CHART_COMPARE_UPDATE } from '../../actions/types';
import {
  saveChartCompare,
  fetchChartError,
  fetchChartDataSecondary,
  updateChartSource,
  fetchChartDataSecondarySuccess,
} from '../../actions/chart';

export function* chartCompare({ data }) {
  try {
    yield put(saveChartCompare(data));
    if (data) {
      yield put(updateChartSource('all'));
      yield put(fetchChartDataSecondary());
    } else {
      yield put(fetchChartDataSecondarySuccess([]));
    }
  } catch (e) {
    yield put(fetchChartError(e));
  }
}

export function* chartCompareSaga() {
  yield takeEvery(CHART_COMPARE_UPDATE, chartCompare);
}
