import { put, takeEvery } from 'redux-saga/effects';
import { CHART_CURRENCY_UPDATE } from '../../actions/types';
import {
  saveChartCurrency,
  fetchChartError,
} from '../../actions/chart';

function* chartCurrency({ data }) {
  try {
    yield put(saveChartCurrency(data));
  } catch (e) {
    yield put(fetchChartError(e));
  }
}

export function* chartCurrencySaga() {
  yield takeEvery(CHART_CURRENCY_UPDATE, chartCurrency);
}
