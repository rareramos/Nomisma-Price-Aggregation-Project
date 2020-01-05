import * as types from '../../actions/types';
import { defaultTabValue } from '../../utils/tabs';

const initialState = {
  tab: defaultTabValue,
  page: 0,
  token: null,
  sort: null,
  order: null,
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TABLE_UPDATE_FILTER:
      return action.data;
    default:
      return state;
  }
};

export default filterReducer;
