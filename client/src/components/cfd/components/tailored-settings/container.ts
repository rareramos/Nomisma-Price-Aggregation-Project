import { connect } from 'react-redux';
import { ICfdState } from 'types/reducers/cfd';
import { ITailoredSettingsMapProps, ITailoredSettingsDispatchProps } from 'types/components/cfd';
import {
  TailoredSettings as TailoredComp,
} from './tailored-settings';
import {
  toggleTailoredView,
  toggleCFDModal,
  onCFDModalTabChange,
  onCFDModalClose,
} from '../../../../actions/cfd';
import {
  selectShowTailoredSettings,
  selectShowCFDModalFromState,
  selectCFDModalData,
  selectCfdInitialMarginTableHeader,
  selectCfdInitialMarginTableKey,
  selectCfdInitialMarginTableBodyFromState,
  selectSelectedTabCFDModalFromState,
} from '../../../../selectors/cfd/ui';

const mapStateToProps = (state : ICfdState) : ITailoredSettingsMapProps => ({
  showTailoredSettings: selectShowTailoredSettings(state),
  showCFDModal: selectShowCFDModalFromState(state),
  cfdModalsData: selectCFDModalData(),
  initialMarginTableHeader: selectCfdInitialMarginTableHeader(),
  initialMarginTableKey: selectCfdInitialMarginTableKey(),
  initialMarginTableBody: selectCfdInitialMarginTableBodyFromState(state),
  selectedTabCFDModal: selectSelectedTabCFDModalFromState(state),
});

const mapDispatchToProps : ITailoredSettingsDispatchProps = {
  toggleTailoredView,
  toggleCFDModal,
  onCFDModalTabChange,
  onCFDModalClose,
};

export const TailoredSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TailoredComp);
