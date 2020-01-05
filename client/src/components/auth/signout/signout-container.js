import { connect } from 'react-redux';
import * as actions from '../../../actions/account';
import { Signout as SignoutComponent } from './signout';

export const Signout = connect(null, actions)(SignoutComponent);
