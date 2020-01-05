import { connect } from 'react-redux';
import { signUserUp } from '../../../actions/account';
import { reduxForm } from 'redux-form';
import { Signup as SignupComp } from './signup';

function validate(formProps) {
  const errors = {};
  if(formProps.password !== formProps.password2) {
    errors.password = 'Password must match';
  }
  return errors;
}

function mapStateToProps({auth}) {
  return {
    errorMsg: auth.error,
  };
}

export const Signup = connect(mapStateToProps, {signUserUp})(reduxForm({
  form: 'signup',
  validate,
})(SignupComp));
