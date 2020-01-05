import { types } from 'actions/types';
import { emptyActionCreator, payloadActionCreator } from 'actions/action-creator-factories';
import {
  IQuasiLive,
  ICfdFormState,
  IMarketsDataState,
  IUpdateableMarketData,
  ISocketState,
} from 'types/reducers/cfd';
import { IHash } from 'types/utils';

export const onFormChange = payloadActionCreator<
types.CFD_FORM_CHANGE,
ICfdFormState
>(types.CFD_FORM_CHANGE);

export const startQuasiLiveFetch = emptyActionCreator(types.CFD_QUASILIVE_START);
export const fetchQuasiLiveData = emptyActionCreator(types.CFD_QUASILIVE_FETCH);

export const saveQuasiLiveData = payloadActionCreator<
types.CFD_QUASILIVE_SAVE,
Array<IQuasiLive>
>(types.CFD_QUASILIVE_SAVE);

export const addAvailableMarkets = payloadActionCreator<
types.ADD_AVAILABLE_MARKETS,
Array<string>
>(types.ADD_AVAILABLE_MARKETS);

export const onMarketSelect = payloadActionCreator<
types.MARKET_SELECTED,
string
>(types.MARKET_SELECTED);

export const addBulkMarketData = payloadActionCreator<
types.ADD_BULK_MARKET_DATA,
IMarketsDataState
>(types.ADD_BULK_MARKET_DATA);

export const fetchAllMarketData = payloadActionCreator<
types.MARKET_DATA_ALL,
IMarketsDataState
>(types.MARKET_DATA_ALL);

export const onUpdateMarketData = payloadActionCreator<
types.MARKET_DATA_UPDATED,
Array<IHash<IUpdateableMarketData>>
>(types.MARKET_DATA_UPDATED);

export const addCFDSocket = payloadActionCreator<
types.ADD_CFD_SOCKET,
Partial<ISocketState>
>(types.ADD_CFD_SOCKET);

export const marketUpdateParameters = emptyActionCreator(types.MARKET_UPDATE_PARAMETERS);
export const toggleTailoredView = emptyActionCreator(types.CFD_TAILORED_VIEW_TOGGLE);
export const toggleCFDModal = emptyActionCreator(types.CFD_MODAL_VIEW_TOGGLE);
export const onCFDModalTabChange = emptyActionCreator(types.CFD_MODAL_TAB_CHANGE);
export const onCFDModalClose = emptyActionCreator(types.CFD_MODAL_CLOSE);
