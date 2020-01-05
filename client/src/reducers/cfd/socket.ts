import { ISocketState } from 'types/reducers/cfd';
import { combineReducers } from 'redux';
import { types } from 'actions/types';
import { ApplicationAction } from 'types/actions';


const channel = (
  state : ISocketState = { socket: null, channel: null },
  action : ApplicationAction,
) : ISocketState => {
  switch (action.type) {
    case types.ADD_CFD_SOCKET:
      return action.data;
    default:
      return state;
  }
};

const socket = (
  state : ISocketState = { socket: null, channel: null },
  action : ApplicationAction,
) : ISocketState => {
  switch (action.type) {
    case types.ADD_CFD_SOCKET:
      return action.data;
    default:
      return state;
  }
};

export const socketReducer = combineReducers({
  socket,
  channel,
});
