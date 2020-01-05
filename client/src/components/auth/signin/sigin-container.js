import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { signUserIn } from '../../../actions/account';

import { Signin as SigninComponent } from './signin';

function mapStateToProps({auth}) {
  return {
    errorMsg: auth.error,
  };
}

export const Signin = connect(mapStateToProps, {signUserIn})(reduxForm({
  form: 'signin',
})(SigninComponent));
