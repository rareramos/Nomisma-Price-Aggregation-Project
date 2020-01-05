import { put, call, fork } from 'redux-saga/effects';

import * as LoansApi from '../../api/loans';
import { fetchLoanTokensSuccess } from '../../actions/loans';

export function* fetchLoanTokens() {
  const response = yield call(LoansApi.fetchLoanTokens);
  yield put(fetchLoanTokensSuccess(response.tokens));
}

export function* loansSaga() {
  yield fork(fetchLoanTokens);
}
