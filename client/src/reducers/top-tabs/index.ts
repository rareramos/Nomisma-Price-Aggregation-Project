import { types } from 'actions/types';
import { ApplicationAction } from 'types/actions';

const initialState = 'lending';

export const topTabsReducer = (
  state : string = initialState,
  action : ApplicationAction,
) : string => {
  switch (action.type) {
    case types.TOP_TABS_SOURCE_SAVE:
      return action.data.data;
    default:
      return state;
  }
};
