import React, { Component } from 'react';
import { bool, object } from 'prop-types';
import { connect } from 'react-redux';

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentDidMount() {
      if (!this.props.authenticated) {
        this.context.router.history.push('/signin');
      }
    }

    render() {
      return <ComposedComponent { ...this.props } />;
    }
  }

  function mapStateToProps({auth}) {
    return { authenticated: auth.authenticated };
  }

  Authentication.propTypes = {
    authenticated: bool,
  };

  Authentication.contextTypes = {
    router: object,
  };

  return connect(mapStateToProps)(Authentication);
}
