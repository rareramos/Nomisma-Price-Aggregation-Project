import {
  SIGNUP_USER,
  AUTH_USER,
  AUTH_ERROR,
} from '../types';

// export function signUserUp(userObj) {
//   return function (dispatch) {
//     // Submit email/password to server
//     axios
//       .post('/signup', userObj)
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

export const signUserUp = (data) => {
  return {
    type: SIGNUP_USER,
    data,
  };
};

export const signUpSuccess = () => {
  return {
    type: AUTH_USER,
  };
};

export const signUpError = (errors) => {
  return {
    type: AUTH_ERROR,
    errors,
  };
};
