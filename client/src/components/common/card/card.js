import React from 'react';
import { oneOfType, arrayOf, node } from 'prop-types';

export const Card = (props) => (
  <div className='row'>
    <div className='col-xs-12 col-sm-2 col-md-3'></div>
    <div className='col-sm-8 col-md-6'>
      { props.children }
    </div>
    <div className='col-xs-12 col-sm-2 col-md-3'></div>
  </div>
);

Card.propTypes = {
  children: oneOfType([
    arrayOf(node),
    node,
  ]),
};
