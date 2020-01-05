import {
  put,
  takeLatest,
  fork,
} from 'redux-saga/effects';
import {
  TOP_TABS_SOURCE_UPDATE,
} from '../../actions/types';
import { saveTopTabsSource } from '../../actions/top-tabs';
import {
  cfdTab,
  lendingTab,
} from '../../utils/top-tabs';
import { startListener, stopListener } from '../cfd';

export function* handleTopTabsSourceChange(
  {
    data,
  },
) {
  if (data === lendingTab) {
    yield fork(stopListener);
  } else if (data === cfdTab) {
    yield fork(startListener);
  }
  yield put(
    saveTopTabsSource(
      {
        data,
      },
    ),
  );
}

export function* topTabsSaga() {
  yield takeLatest(TOP_TABS_SOURCE_UPDATE, handleTopTabsSourceChange);
}
