import { IHash } from 'types/utils';
import { IQuasiLive } from 'types/reducers/cfd';

export interface IInstrumentScrapingData {
  classification : string;
  expiry : string;
  lastUpdatedAt : string;
  nomismaSymbol : string;
  pair : string;
  scrapingSymbol : string;
  serviceName : string;
}
export type TInstrument<Type> = IHash<IHash<Type>>;

export interface IInstrumentState {
  quasiLive : TInstrument<IQuasiLive>;
  scraping : TInstrument<IInstrumentScrapingData>;
  unmatched : TInstrument<IQuasiLive>;
}
