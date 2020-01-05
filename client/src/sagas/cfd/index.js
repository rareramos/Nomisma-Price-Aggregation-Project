import {
  eventChannel,
} from 'redux-saga';
import {
  call,
  takeEvery,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  createSocketChannel,
  createSocket,
  availableMarketsEvtType,
  marketSelectedEvtType,
  marketDataBulkEvtType,
  marketDataAllEvtType,
  marketDataUpdateEvtType,
} from '../../api/cfd';
import * as types from '../../actions/types';
import { selectSocketChannelFromState } from '../../selectors/cfd/socket';

import {
  startFetchingQuasiLiveSaga,
  fetchQuasiLiveSaga,
} from './quasi-live';
import { handleMarketUpdateParameters } from './market-update-parameters';

const supportedEventTypesToActionTypesMap = {
  [availableMarketsEvtType]: types.ADD_AVAILABLE_MARKETS,
  [marketSelectedEvtType]: types.MARKET_SELECTED,
  [marketDataBulkEvtType]: types.ADD_BULK_MARKET_DATA,
  [marketDataAllEvtType]: types.MARKET_DATA_ALL,
  [marketDataUpdateEvtType]: types.MARKET_DATA_UPDATED,
};

export function* processListener(payload) {
  const actionType = supportedEventTypesToActionTypesMap[payload.type];
  yield put({
    type: actionType,
    data: payload.payload,
  });
}

export function* startListener() {
  const socket = createSocket();
  const channel = yield call(createSocketChannel, {
    eventChannel,
    socket,
  });
  yield put({
    type: types.ADD_CFD_SOCKET,
    data: {
      socket,
      channel,
    },
  });
  yield takeEvery(channel, processListener);
}

export function* stopListener() {
  const channel = yield select(selectSocketChannelFromState);
  if (channel) {
    yield channel.close();
  }
}

export function* cfdSaga() {
  yield takeLatest(types.MARKET_UPDATE_PARAMETERS, handleMarketUpdateParameters);
  yield takeLatest(types.CFD_QUASILIVE_START, startFetchingQuasiLiveSaga);
  yield takeLatest(types.CFD_QUASILIVE_FETCH, fetchQuasiLiveSaga);
}
