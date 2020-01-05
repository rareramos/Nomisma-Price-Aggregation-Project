import React, {Component} from 'react';
import { func } from 'prop-types';

export class Signout extends Component {
  componentDidMount() {
    this.props.signUserOut();
  }
  render() {
    return (
      <div>
        <h1>Hope to see you soon!</h1>
      </div>
    );
  }
}

Signout.propTypes = {
  signUserOut: func,
};
