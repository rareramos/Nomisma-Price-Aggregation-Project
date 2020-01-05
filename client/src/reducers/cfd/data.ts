import { ICfdFormState } from 'types/reducers/cfd';
import { types } from 'actions/types';
import { cfdColumns } from 'utils';
import { ApplicationAction } from 'types/actions';

const initialCfdFormState : ICfdFormState = {
  bitmex: 10,
  currencyPairs: 'BTC/USD',
  cvaFva: 'Default',
  deribit: 25,
  futureContract: 'Perpetual',
  holdingPeriod: '30',
  brokersCreditCVA: 'Credit Grade',
  okex: 15,
  kraken: 20,
  columnsData: [...cfdColumns],
};

export const formDataReducer = (
  state : ICfdFormState = initialCfdFormState,
  action : ApplicationAction,
) : ICfdFormState => {
  switch (action.type) {
    case types.CFD_FORM_CHANGE:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
