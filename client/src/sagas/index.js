import { call, fork } from 'redux-saga/effects';

// import {
//   tableSaga,
// } from './table';

import {
  topTabsSaga,
} from './top-tabs';

import {
  chartCompareSaga,
  chartCurrencySaga,
  chartFetchSecondarySaga,
  chartPeriodSaga,
  chartSourceSaga,
  fetchChartSaga,
} from './chart';
import { loansSaga } from './loans';

import { cfdSaga } from './cfd';

import { instrumentsSaga } from './instruments';

export function* rootSaga() {
  yield fork(cfdSaga);
  yield fork(chartCompareSaga);
  yield fork(chartCurrencySaga);
  yield fork(chartFetchSecondarySaga);
  yield fork(chartPeriodSaga);
  yield fork(chartSourceSaga);
  yield fork(fetchChartSaga);
  yield fork(instrumentsSaga);
  yield fork(topTabsSaga);
  yield call(loansSaga);
  // yield call(tableSaga);
}
