import { connect } from 'react-redux';
import { Dashboard as DashboardComp } from './dashboard';
import {
  selectColumns,
  selectServicesData,
} from '../../selectors/instruments';
import { fetchInstruments } from '../../actions/instruments';

const mapStateToProps = state => ({
  services: selectServicesData(state),
  columns: selectColumns(),
});

const mapDispatchToProps = { fetchInstruments };

export const Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardComp);
