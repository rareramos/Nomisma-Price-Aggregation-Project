import {
  types,
} from 'actions/types';
import {
  emptyActionCreator,
  payloadActionCreator,
} from 'actions/action-creator-factories';

import { IHash } from 'types/utils';
import { IQuasiLive } from 'types/reducers/cfd';
import { IInstrumentScrapingData } from 'types/reducers/instruments';

export const fetchInstruments = emptyActionCreator(types.FETCH_INSTRUMENTS);

export const setQuasiLiveInstruments = payloadActionCreator<
types.SET_QUASI_LIVE_INSTRUMENTS,
IHash<IHash<IQuasiLive>>
>(types.SET_QUASI_LIVE_INSTRUMENTS);

export const setScrapingInstruments = payloadActionCreator<
types.SET_SCRAPING_INSTRUMENTS,
IHash<IHash<IInstrumentScrapingData>>
>(types.SET_SCRAPING_INSTRUMENTS);

export const setUnmatchedInstruments = payloadActionCreator<
types.SET_UNMATCHED_INSTRUMENTS,
IHash<IHash<IQuasiLive>>
>(types.SET_UNMATCHED_INSTRUMENTS);
