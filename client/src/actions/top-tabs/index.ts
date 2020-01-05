import { types } from 'actions/types';
import { payloadActionCreator } from 'actions/action-creator-factories';


export const updateTopTabsSource = payloadActionCreator<
types.TOP_TABS_SOURCE_UPDATE,
string
>(types.TOP_TABS_SOURCE_UPDATE);

export const saveTopTabsSource = payloadActionCreator<
types.TOP_TABS_SOURCE_SAVE,
{ data : string }
>(types.TOP_TABS_SOURCE_SAVE);
