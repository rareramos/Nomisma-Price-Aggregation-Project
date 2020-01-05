import { connect } from 'react-redux';
import { ICfdDispatchProps } from 'types/components/cfd';
import { Cfd as CfdComp } from './cfd';
import {
  startQuasiLiveFetch,
} from '../../actions/cfd';

const mapDispatchToProps : ICfdDispatchProps = { startQuasiLiveFetch };

export const Cfd = connect(
  null,
  mapDispatchToProps,
)(CfdComp);
