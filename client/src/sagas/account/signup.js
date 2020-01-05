import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

import { SIGNUP_USER } from '../../actions/types';
import { signUpSuccess, signUpError } from '../../actions/account/signUp';
import { URLS } from '../../api';

function* signUserUp(data) {
  try {
    const url = URLS.signupAPIURL();
    const res = yield axios.post(url, data);

    localStorage.setItem('auth_jwt_token', res.data.token);
    window.location = '/#account';
    axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token');

    yield put(signUpSuccess());
  } catch (err) {
    const message = 'Signup Error, try later.';
    yield put(signUpError(message));
  }
}

export function* signUpSaga() {
  yield takeEvery(SIGNUP_USER, signUserUp);
}

