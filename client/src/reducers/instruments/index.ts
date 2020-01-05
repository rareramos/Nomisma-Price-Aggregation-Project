import { types } from 'actions/types';
import { ApplicationAction } from 'types/actions';
import { IInstrumentState } from 'types/reducers/instruments';

const initialState : IInstrumentState = {
  quasiLive: {},
  scraping: {},
  unmatched: {},
};

export const instruments = (
  state : IInstrumentState = initialState,
  action : ApplicationAction,
) : IInstrumentState => {
  switch (action.type) {
    case types.SET_QUASI_LIVE_INSTRUMENTS:
      if (action.data) {
        return {
          ...state,
          quasiLive: action.data,
        };
      }
      return state;
    case types.SET_SCRAPING_INSTRUMENTS:
      if (action.data) {
        return {
          ...state,
          scraping: action.data,
        };
      }
      return state;
    case types.SET_UNMATCHED_INSTRUMENTS:
      if (action.data) {
        return {
          ...state,
          unmatched: action.data,
        };
      }
      return state;
    default:
      return state;
  }
};
