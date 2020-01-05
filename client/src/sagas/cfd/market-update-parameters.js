import { all, select } from 'redux-saga/effects';

import { selectSocketObjectFromState } from '../../selectors/cfd/socket';

import { marketUpdateParamentersEvtType } from '../../api/cfd';

function* emitMarketUpdateParameters() {
  const socket = yield select(selectSocketObjectFromState);
  socket.emit(marketUpdateParamentersEvtType, null);
}

export function* handleMarketUpdateParameters() {
  yield all([emitMarketUpdateParameters()]);
}
