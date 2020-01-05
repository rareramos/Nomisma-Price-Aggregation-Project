import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  TRY_CONNECT,
} from '../../actions/types';

const INITIAL_STATE = {
  auth: {
    loading: false,
    authenticated: false,
    error: null,
  },
  user: {
    profile: null,
    loading: false,
    error: null,
  },

};

export const AccountReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, error: '', authenticated: true };
    case UNAUTH_USER:
      return { ...state, authenticated: false };
    case AUTH_ERROR:
      return { ...state, error: action.data };
    case TRY_CONNECT:
      return { ...state, loading: action.data };
    default:
      return state;
  }
};
