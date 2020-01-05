import * as types from '../../actions/types';
import { defaultCurrencyValue } from '../../utils/chart';

const initialState = defaultCurrencyValue;

const currencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHART_CURRENCY_SAVE:
      return action.data;
    default:
      return state;
  }
};

export default currencyReducer;
