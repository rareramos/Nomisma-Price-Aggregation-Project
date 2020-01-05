import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../actions/types';

import {
  setQuasiLiveInstruments,
  setScrapingInstruments,
  setUnmatchedInstruments,
} from '../../actions/instruments';

import {
  fetchQuasiLiveInstruments,
  fetchScrapingInstruments,
  fetchUnmatchedInstruments,
} from '../../api/instruments';

export function* fetchInstrumentsSaga() {
  let data = null;
  data = yield call(fetchQuasiLiveInstruments);
  yield put(setQuasiLiveInstruments(data));
  data = yield call(fetchScrapingInstruments);
  yield put(setScrapingInstruments(data));
  data = yield call(fetchUnmatchedInstruments);
  yield put(setUnmatchedInstruments(data));
}

export function* instrumentsSaga() {
  yield takeLatest(types.FETCH_INSTRUMENTS, fetchInstrumentsSaga);
}
