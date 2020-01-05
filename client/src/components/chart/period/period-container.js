import { connect } from 'react-redux';
import { Period as PeriodComp } from './period';
import { updateChartPeriod } from '../../../actions/chart';
import {
  selectPeriodFromState,
  selectChartPeriodsSelector,
} from '../../../selectors/chart';

const mapStateToProps = (state) => ({
  selectedSource: selectPeriodFromState(state),
  periods: selectChartPeriodsSelector(),
});

const mapDispatchToProps = (dispatch) => ({
  onClick: (selected) => dispatch(updateChartPeriod(selected)),
});

export const Period = connect(mapStateToProps, mapDispatchToProps)(PeriodComp);
