import { connect } from 'react-redux';
import { TopTabs as TopTabsComp } from './top-tabs';
import { updateTopTabsSource } from '../../actions/top-tabs';
import {
  selectTopTabIndex,
  selectTopTabsSelector,
} from '../../selectors/top-tabs';

const mapStateToProps = state => ({
  selectedSource: selectTopTabIndex(state),
  tabs: selectTopTabsSelector(),
});

export const TopTabs = connect(
  mapStateToProps,
  {
    onClick: updateTopTabsSource,
  },
)(TopTabsComp);
