import { Socket } from 'socket.io';

export interface IMarketSubscriberProperties {
  [key : string] : Socket;
}

export interface ISubscribersByMarketHash {
  [key : string] : IMarketSubscriberProperties;
}

export interface ICurrencyPairHash {
  [key : string] : boolean;
}

export interface IMarketProperties {
  [key : string] : ISinkData;
}

export interface IMarketsData {
  [key : string] : IMarketProperties;
}

export interface ICacheProperties {
  [key : string ] : IMarketUpdatedDataProperties;
}

export interface ICache {
  [key : string ] : Array<ICacheProperties>;
}

export interface IMarketUpdatedDataProperties {
  symbol : string;
  bid : number;
  offer : number;
}

export interface IMarketUpdatedData {
  [key : string ] : IMarketUpdatedDataProperties;
}

export interface ISinkData {
  symbol ? : string;
  serviceName : string;
  base : string;
  underlying : string;
  bid : number;
  offer : number;
}

export interface IMarketBulkData {
  [key : string] : ISinkData;
}
