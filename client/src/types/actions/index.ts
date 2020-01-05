import {
  TActionsMap,
  TActionMap,
} from 'actions/action-creator-factories/types';

import * as cfdActions from 'actions/cfd';
import * as instrumentActions from 'actions/instruments';
import * as topTabActions from 'actions/top-tabs';

export { cfdActions };
export type TCfdActionCreators = typeof cfdActions;
export type TCfdActionMap = TActionMap<TCfdActionCreators>;

export { instrumentActions };
export type TInstrumentActionCreators = typeof instrumentActions;
export type TInstrumentActionMap = TActionMap<TInstrumentActionCreators>;

export { topTabActions };
export type TTopTabActionCreators = typeof topTabActions;
export type TTopTabActionMap = TActionMap<TTopTabActionCreators>;

export type ApplicationAction = TActionsMap<TCfdActionCreators>
| TActionsMap<TInstrumentActionCreators>
| TActionsMap<TTopTabActionCreators>;
