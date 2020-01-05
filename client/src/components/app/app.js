import React from 'react';
import { ThemeProvider } from 'styled-components';
import { oneOfType, arrayOf, node } from 'prop-types';

import { StyledRoot, StyledContainer } from './styled';
import { theme } from '@nomisma/nomisma-ui/themes';

export const App = ({ children }) => (
  <ThemeProvider theme={ theme }>
    <StyledRoot>
      <StyledContainer>
        { children }
      </StyledContainer>
    </StyledRoot>
  </ThemeProvider>
);

App.propTypes = {
  children: oneOfType([
    arrayOf(node),
    node,
  ]),
};
