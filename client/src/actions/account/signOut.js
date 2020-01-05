import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
} from '../types';


// export function signUserOut() {
//   return function (dispatch) {
//     dispatch({type: UNAUTH_USER});
//     localStorage.removeItem('auth_jwt_token');
//   };
// }

export const signUserOut = () => {
  return {
    type: UNAUTH_USER,
  };
};

export const signOutSuccess = () => {
  return {
    type: AUTH_USER,
  };
};

export const signOutError = (errors) => {
  return {
    type: AUTH_ERROR,
    errors,
  };
};
