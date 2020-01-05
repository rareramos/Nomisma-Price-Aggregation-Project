/* eslint-disable react/no-multi-comp */
import React from 'react';
import Loadable from 'react-loadable';
import { string } from 'prop-types';
import SvgClose from '@nomisma/nomisma-ui/icons/Close';
import { Loading } from '@nomisma/nomisma-ui/beta/loading';
import memoize from 'lodash/memoize';

export const LoadableTokenIconHOC = memoize(symbol =>
  () => {
    const LoadableIcon = Loadable({
      loader: () =>
        import(`@nomisma/nomisma-ui/token-icons/${symbol[0] + symbol.slice(1).toLowerCase()}.js`),
      render(loaded) {
        const Icon = loaded.default;
        return <Icon />;
      },
      loading: (error) =>
        error ?
          <SvgClose /> :
          <Loading
            width='14px'
            height='14px'
            fill='var(--primary)'
          />,
    });

    return <LoadableIcon />;
  },
);

LoadableTokenIconHOC.propTypes = {
  symbol: string.isRequired,
};
