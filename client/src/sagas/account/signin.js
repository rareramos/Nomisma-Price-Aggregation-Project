import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

import { SIGNIN_USER } from '../../actions/types';
import { signInSuccess, signInError } from '../../actions/account/signIn';
import { URLS } from '../../api';

function* signUserIn(data) {
  try {
    const url = URLS.signinAPIURL();
    const res = yield axios.post(url, data);

    localStorage.setItem('auth_jwt_token', res.data.token);
    window.location = '/#account';
    axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token');

    yield put(signInSuccess());
  } catch (err) {
    const message = 'Signin Error, try later.';
    yield put(signInError(message));
  }
}

export function* signInSaga() {
  yield takeEvery(SIGNIN_USER, signUserIn);
}

