import { fetchChartData } from '../../actions/chart';
import { connect } from 'react-redux';
import { ChartView } from './chart';
import { selectChartLoadingSelector } from '../../selectors/chart/loading';
import {
  selectDisplayChartRecordsFromState,
  selectDisplayChartSecondaryRecordsFromState,
} from '../../selectors/chart/data';
import {
  selectPeriodFromState,
  selectChartCurrencyFromState,
  selectChartSourceFromState,
  selectChartComapreFromState,
} from '../../selectors/chart/index';

const mapStateToProps = state => ({
  loading: selectChartLoadingSelector(state),
  chartData: selectDisplayChartRecordsFromState(state),
  chartDataSecondary: selectDisplayChartSecondaryRecordsFromState(state),
  period: selectPeriodFromState(state),
  currency: selectChartCurrencyFromState(state),
  protocol: selectChartSourceFromState(state),
  compare: selectChartComapreFromState(state),
});
const mapDispatchToProps = (dispatch) => ({
  fetchChartData: (value, aa) => dispatch(fetchChartData(value, aa)),
});

export const Chart = connect(mapStateToProps, mapDispatchToProps)(ChartView);
