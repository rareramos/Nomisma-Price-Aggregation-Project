import { put, takeEvery, select } from 'redux-saga/effects';
import { CHART_PERIOD_UPDATE } from '../../actions/types';
import { selectChartSourceFromState, selectChartComapreFromState } from '../../selectors/chart/index';
import {
  fetchChartData,
  saveChartPeriod,
  fetchChartError,
  updateChartCompare,
} from '../../actions/chart';

function* chartPeriod({ data }) {
  try {
    const source = yield select(selectChartSourceFromState);
    yield put(fetchChartData(source, data));
    yield put(saveChartPeriod(data));
    const compare = yield select(selectChartComapreFromState);
    if (compare && source === 'all') {
      yield put(updateChartCompare(true));
    }
  } catch (e) {
    yield put(fetchChartError(e));
  }
}

export function* chartPeriodSaga() {
  yield takeEvery(CHART_PERIOD_UPDATE, chartPeriod);
}
