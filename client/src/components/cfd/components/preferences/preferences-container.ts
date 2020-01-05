import { connect } from 'react-redux';
import { ICfdState } from 'reducers/cfd';
import { Preferences as PreferencesComp } from './preferences';
import {
  IPreferencesDispatchProps,
  IPreferencesMapProps,
} from '../../../../types/components/cfd';
import {
  selectCvaFvaItems,
  selectCfdFormDataFromState,
  selectCurrencyPairsItemsFromState,
  selectFutureContractItemsFromState,
  selectFutureContractFromState,
} from '../../../../selectors/cfd';
import {
  marketUpdateParameters,
} from '../../../../actions/cfd';

const mapStateToProps = (state : ICfdState) : IPreferencesMapProps => ({
  cvaFvaItems: selectCvaFvaItems(),
  currencyPairsItems: selectCurrencyPairsItemsFromState(state),
  futureContractItems: selectFutureContractItemsFromState(state),
  futureContract: selectFutureContractFromState(state),
  ...selectCfdFormDataFromState(state),
});

const mapDispatchToProps : IPreferencesDispatchProps = {
  marketUpdateParameters,
};

export const Preferences = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferencesComp);
