import axios from 'axios/index';
import {
  AUTH_USER,
  SIGNIN_USER,
  AUTH_ERROR,
} from '../types';

import { URLS } from '../../api';

axios.defaults.baseURL = URLS.ROOT_URL;
if (localStorage.getItem('auth_jwt_token')) {
  axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token');
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// export function signUserIn(data) {
//   return function (dispatch) {
//     // Submit email/password to server
//     axios
//       .post('/signin', data)
//       .then(res => {
//         dispatch({type: AUTH_USER});
//         localStorage.setItem('auth_jwt_token', res.data.token);
//         window.location = '/#account';
//         axios.defaults.headers.common.Authorization = localStorage.getItem('auth_jwt_token');
//       })
//       .catch(error => {
//         dispatch({type: AUTH_ERROR, payload: error});
//       });
//   };
// }

export const signUserIn = (data) => {
  return {
    type: SIGNIN_USER,
    data,
  };
};

export const signInSuccess = () => {
  return {
    type: AUTH_USER,
  };
};

export const signInError = (errors) => {
  return {
    type: AUTH_ERROR,
    errors,
  };
};
