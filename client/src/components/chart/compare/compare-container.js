import { connect } from 'react-redux';
import { ComapreComp } from './compare';
import { updateChartCompare } from '../../../actions/chart';
import {
  selectChartComapreFromState,
} from '../../../selectors/chart';

const mapStateToProps = state => ({
  isInComapreMode: selectChartComapreFromState(state),
});

const mapDispatchToProps = dispatch => ({
  onClick: val => dispatch(updateChartCompare(val)),
});

export const Compare = connect(mapStateToProps, mapDispatchToProps)(ComapreComp);
