import { connect} from 'react-redux';
import { getUserProfile, tryConnect, updateUserProfile } from '../../actions/account';
import { reduxForm } from 'redux-form';

import {Account as AccountComponent} from './account';

function mapStateToProps({auth, user}) {
  return user.profile ? {
    status: auth.status,
    profile: user.profile,
    initialValues: {
      email: user.profile.email,
      firstName: user.profile.name.first,
      lastName: user.profile.name.last,
    },
    updateProfileFailMsg: user.updateProfileFailMsg,
  } : {
    status: auth.status,
    profile: user.profile,
  };
}


export const Account = connect(mapStateToProps, {
  tryConnect,
  getUserProfile,
  updateUserProfile,
})(reduxForm({
  form: 'profileUpdate',
})(AccountComponent));
