import { connect } from 'react-redux';
import { CurrenciesComp } from './currency';
import { updateChartCurrency } from '../../../actions/chart';
import {
  selectChartCurrencyFromState,
  selectChartCurrenciesSelector,
} from '../../../selectors/chart';

const mapStateToProps = state => ({
  selectedSource: selectChartCurrencyFromState(state),
  currencies: selectChartCurrenciesSelector(),
});

const mapDispatchToProps = dispatch => ({
  onClick: selected => dispatch(updateChartCurrency(selected)),
});

export const Currencies = connect(mapStateToProps, mapDispatchToProps)(CurrenciesComp);
