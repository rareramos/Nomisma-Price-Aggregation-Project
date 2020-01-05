import {
  call,
  delay,
  put,
} from 'redux-saga/effects';

import { createLogger } from '@nomisma/nomisma-logger';

import {
  saveQuasiLiveData,
  fetchQuasiLiveData,
} from '../../actions/cfd';

import {
  fetchQuasiLiveFromServer,
} from '../../api/cfd';

import { app } from '../../../environment';

const log = createLogger(parseInt(app.DEFAULT_LOG_LEVEL, 10));

export function* fetchQuasiLiveSaga() {
  const data = yield call(fetchQuasiLiveFromServer);
  if (data !== undefined) {
    yield put(saveQuasiLiveData(data));
  }
}

export function* startFetchingQuasiLiveSaga() {
  const delayInMinutes = 1;
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      yield put(fetchQuasiLiveData());
      yield delay(1000 * 60 * delayInMinutes);
    }
  } catch (e) {
    log.error({
      message: `Error occurred while fetching quasi-live data: ${e}`,
    });
  }
}
