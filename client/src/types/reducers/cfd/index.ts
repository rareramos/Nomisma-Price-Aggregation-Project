import {
  ICfdColumn,
  IHash,
  TStringOrNumber,
} from 'types/utils';

export interface ICfdFormState {
  cvaFva : string;
  currencyPairs : string;
  futureContract : string;
  positionPeriod ? : number;
  bitmex : number;
  okex : number;
  kraken : number;
  deribit : number;
  holdingPeriod ? : string;
  brokersCreditCVA : string;
  columnsData : Array<ICfdColumn>;
}

export interface IUpdateableMarketData {
  bid : number;
  offer : number;
  symbol : string;
}

export interface IMarketData {
  symbol ? : string;
  serviceName : string;
  base : string;
  underlying : string;
  bid : number;
  offer : number;
  [key : string] : TStringOrNumber;
}

export interface IMarketsDataState {
  [key : string] : IMarketData;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMarketUpdateParameterState {}

export type TMarketUpdateParameterState = IMarketUpdateParameterState | null;

export interface IQuasiLive {
  serviceName : string;
  symbol : string;
  base : string;
  bid : number;
  classification : string;
  contract : string;
  expiry : string;
  fundingLong : number;
  fundingShort : number;
  makerFee : number;
  margin : number;
  marginCcy : string;
  name : string;
  offer : number;
  takerFee : number;
  underlying : string;
}

export interface IQuasiLiveProviderWrapper {
  [key : string] : Array<IQuasiLive>;
}

export type IQuasiLiveState = IHash<IQuasiLiveProviderWrapper>;

export interface ISocketState {
  socket ? : SocketIOClient.Socket;
  channel ? : {
    take : Function;
    flush : Function;
    close : Function;
  };
}

export interface ICfdState {
  formData : ICfdFormState;
  socket : ISocketState;
  selectedMarket : string | null;
  availableMarkets : Array<string>;
  marketData : IMarketsDataState;
  quasiLive : IQuasiLiveState;
  marketUpdateParameters : TMarketUpdateParameterState;
}
