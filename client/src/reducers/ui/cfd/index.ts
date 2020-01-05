import { types } from 'actions/types';
import { ITailoredSettingState } from 'types/reducers/ui/cfd';
import { ApplicationAction } from 'types/actions';

const initialState : ITailoredSettingState = {
  showTailoredSettings: false,
  showCFDModal: false,
  selectedTabCFDModal: 0,
};

export const cfd = (
  state : ITailoredSettingState = initialState,
  action : ApplicationAction,
) : ITailoredSettingState => {
  switch (action.type) {
    case types.CFD_TAILORED_VIEW_TOGGLE:
      return {
        ...state,
        showTailoredSettings: !state.showTailoredSettings,
      };
    case types.CFD_MODAL_VIEW_TOGGLE:
      return {
        ...state,
        showCFDModal: !state.showCFDModal,
      };
    case types.CFD_MODAL_CLOSE:
      return {
        ...state,
        showCFDModal: false,
      };
    default:
      return state;
  }
};
