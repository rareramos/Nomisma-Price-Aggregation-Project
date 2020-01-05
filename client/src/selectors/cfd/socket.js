import { selectCfdFromState } from './index';

export const selectSocketReducerDataFromState = state => selectCfdFromState(state).socket;

export const selectSocketObjectFromState = state => selectSocketReducerDataFromState(state).socket;

export const selectSocketChannelFromState = state => selectSocketReducerDataFromState(state).channel;
