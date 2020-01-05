import { put, takeEvery } from 'redux-saga/effects';

import { SIGNOUT_USER } from '../../actions/types';
import { signOutSuccess, signOutError } from '../../actions/account/signOut';

function* signUserOut() {
  try {
    localStorage.removeItem('auth_jwt_token');

    yield put(signOutSuccess());
  } catch (err) {
    const message = 'Signout Error, try later.';
    yield put(signOutError(message));
  }
}

export function* signOutSaga() {
  yield takeEvery(SIGNOUT_USER, signUserOut);
}

