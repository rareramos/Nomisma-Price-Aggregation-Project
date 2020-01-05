import { connect } from 'react-redux';
import { IHomeProps } from 'types/components/home';
import { updateTopTabsSource } from '../../actions/top-tabs';
import { Home as HomeView } from './home';

const mapDispatchToProps = (dispatch) : IHomeProps => ({
  navigateToCFD: (data = 'cfd') => dispatch(updateTopTabsSource(data)),
});

export const Home = connect(null, mapDispatchToProps)(HomeView);
