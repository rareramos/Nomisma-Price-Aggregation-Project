import { basicGet } from '@nomisma/utils';

import { getInstrumentsURL } from './urls';

export const fetchQuasiLiveInstruments = params => basicGet(getInstrumentsURL(params, 'quasi-live'))();

export const fetchScrapingInstruments = params => basicGet(getInstrumentsURL(params, 'scraping'))();

export const fetchUnmatchedInstruments = params => basicGet(getInstrumentsURL(params, 'unmatched'))();
