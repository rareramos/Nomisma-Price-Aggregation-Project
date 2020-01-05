import { connect } from 'react-redux';
import { SourceComp } from './source';
import { updateChartSource } from '../../../actions/chart';
import {
  selectChartSourceFromState,
  selectChartSourcesSelector,
} from '../../../selectors/chart';

const mapStateToProps = (state) => ({
  selectedSource: selectChartSourceFromState(state),
  sources: selectChartSourcesSelector(),
});

const mapDispatchToProps = (dispatch) => ({
  onClick: (selected) => dispatch(updateChartSource(selected)),
});

export const Source = connect(mapStateToProps, mapDispatchToProps)(SourceComp);
