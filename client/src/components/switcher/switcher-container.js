import { connect } from 'react-redux';
import { Switcher as SwitcherComp } from './switcher';
import { updateTableSource } from '../../actions/table';
import {
  selectTableSwitcherTabsSelector,
  selectTableTabIndex,
} from '../../selectors/table';

const mapStateToProps = (state) => ({
  selectedSource: selectTableTabIndex(state),
  tabs: selectTableSwitcherTabsSelector(),
});

const mapDispatchToProps = (dispatch) => ({
  onClick: (selected) => dispatch(updateTableSource(selected)),
});

export const Switcher = connect(mapStateToProps, mapDispatchToProps)(SwitcherComp);
