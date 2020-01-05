import { connect } from 'react-redux';

import { TokenSelector } from './token-selector';
import { selectLoanTokens } from '../../selectors/loans';
import { selectTableToken } from '../../selectors/table';
import { updateTableToken } from '../../actions/table';

const mapStateToProps = state => ({
  tokens: selectLoanTokens(state),
  selectedToken: selectTableToken(state),
});

const mapDispatchToProps = dispatch => ({
  onSelectToken: token => dispatch(updateTableToken(token)),
});

export const TokenSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TokenSelector);
