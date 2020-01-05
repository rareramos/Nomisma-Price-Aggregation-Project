import React from 'react';
import { string } from 'prop-types';
import { LoadableTokenIconHOC } from './loadable-token-icon-hoc';

export const LoadableTokenIcon = ({ symbol, ...otherProps}) => {
  const LoadableIcon = LoadableTokenIconHOC(symbol);
  return <LoadableIcon { ...otherProps } />;
};

LoadableTokenIcon.propTypes = {
  symbol: string.isRequired,
};
