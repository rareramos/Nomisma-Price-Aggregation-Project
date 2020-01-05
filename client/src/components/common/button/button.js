import React from 'react';
import { oneOfType, arrayOf, node } from 'prop-types';

export const Button = props => <button { ...props }>{ props.children }</button>;

Button.propTypes = {
  children: oneOfType([
    arrayOf(node),
    node,
  ]),
};
