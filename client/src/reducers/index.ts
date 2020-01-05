import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { IState } from 'types/reducers';
import { chartReducer as chart } from './chart';
import { loansReducer as loans } from './loans';
import { topTabsReducer as topTab } from './top-tabs';
import { cfdReducer as cfd } from './cfd';
import { instruments } from './instruments';
import { ui } from './ui';

export const rootReducer = combineReducers<IState>({
  form,
  chart,
  loans,
  topTab,
  cfd,
  instruments,
  ui,
});
