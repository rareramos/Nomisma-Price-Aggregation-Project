import React, { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import { oneOfType, arrayOf, node } from 'prop-types';
import { IApp } from 'types/components/app';
import { theme } from '@nomisma/nomisma-ui/themes';
import { StyledRoot, StyledWrapper } from './styled';

export const App = ({ children } : IApp) : ReactElement => (
  <ThemeProvider theme={theme}>
    <StyledRoot>
      <StyledWrapper>
        { children }
      </StyledWrapper>
    </StyledRoot>
  </ThemeProvider>
);

App.propTypes = {
  children: oneOfType([
    arrayOf(node),
    node,
  ]).isRequired,
};
