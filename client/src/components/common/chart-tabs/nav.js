import styled from 'styled-components';
import {
  theme,
} from '@nomisma/nomisma-ui/themes';

export const Nav = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  top: ${(props) => props.sticky ? '0' : '' };
  background: ${theme.white};
  z-index: 1;
  display: flex;
  border: 2px solid ${theme.primary};
  border-radius: 5px;
  justify-content: space-between;
  margin-top: 2rem;
`;
