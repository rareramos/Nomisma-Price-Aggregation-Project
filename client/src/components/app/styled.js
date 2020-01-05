import styled from 'styled-components';
import { Container } from '@nomisma/nomisma-ui/container';
import { StyledApp } from '@nomisma/nomisma-ui/styled-app';

export const StyledRoot = styled(StyledApp)`
  color: var(--text);
  display: grid;
  height: 100vh;
`;

export const StyledContainer = styled(Container)`
  height: 100vh;
`;
