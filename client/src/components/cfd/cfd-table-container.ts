import { connect } from 'react-redux';
import { ICfdTableMapProps } from 'types/components/cfd';
import { ICfdState } from 'reducers/cfd';
import { CfdTable as CfdTableComp } from './cfd-table';
import {
  selectCfdColumnsFromState,
  selectCfdDisplayTableRecordsFromState,
  selectCfdHeaderFromState,
  selectCfdKeyFromState,
  selectCfdBodyFromState,
  selectUniqueProvidersFromState,
} from '../../selectors/cfd';

const mapStateToProps = (state : ICfdState) : ICfdTableMapProps => ({
  cfdHeader: selectCfdHeaderFromState(state),
  cfdKey: selectCfdKeyFromState(state),
  cfdBody: selectCfdBodyFromState(state),
  tableData: selectCfdDisplayTableRecordsFromState(state),
  columns: selectCfdColumnsFromState(state),
  uniqueProviderNames: selectUniqueProvidersFromState(state),
});

const mapDispatchToProps = null;

const options = {
  areStatesEqual(next, prev) {
    return prev.cfd.marketData === next.cfd.marketData && prev.cfd.quasiLive === next.cfd.quasiLive;
  },
};

export const CfdTable = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options,
)(CfdTableComp);
