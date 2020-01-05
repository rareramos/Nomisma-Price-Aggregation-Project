import { call, fork } from 'redux-saga/effects';

import {
  tableSaga,
} from './table';

import {
  fetchChartSaga,
  chartPeriodSaga,
  chartSourceSaga,
  chartCurrencySaga,
  chartCompareSaga,
  chartFetchSecondarySaga,
} from './chart';

import { signInSaga, signUpSaga, signOutSaga } from './account';

import { loansSaga } from './loans';

export function* rootSaga() {
  yield fork(signInSaga);
  yield fork(signUpSaga);
  yield fork(signOutSaga);
  yield fork(fetchChartSaga);
  yield fork(chartPeriodSaga);
  yield fork(chartSourceSaga);
  yield fork(chartCurrencySaga);
  yield fork(chartCompareSaga);
  yield fork(chartFetchSecondarySaga);
  yield call(loansSaga);
  yield call(tableSaga);
}
