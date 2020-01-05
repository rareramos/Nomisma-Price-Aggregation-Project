import { combineReducers } from 'redux';
import {
  ICfdFormState,
  IMarketsDataState,
  IQuasiLiveState,
  ISocketState,
  TMarketUpdateParameterState,
} from 'types/reducers/cfd';
import { formDataReducer as formData } from './data';
import { socketReducer as socket } from './socket';
import { availableMarkets } from './available-markets';
import { availableMarkets as selectedMarket } from './selected-market';
import { marketData } from './market-data';
import { quasiLiveReducer as quasiLive } from './quasi-live';
import { marketUpdateParameters } from './market-update-parameters';


export interface ICfdState {
  formData : ICfdFormState;
  socket : ISocketState;
  selectedMarket : string | null;
  availableMarkets : Array<string>;
  marketData : IMarketsDataState;
  quasiLive : IQuasiLiveState;
  marketUpdateParameters : TMarketUpdateParameterState;
}

export const cfdReducer = combineReducers({
  formData,
  socket,
  selectedMarket,
  availableMarkets,
  marketData,
  quasiLive,
  marketUpdateParameters,
});
