import styled from 'styled-components';
import {
  theme,
} from '@nomisma/nomisma-ui/themes';

export const NavItem = styled.li`
  background: ${(props) => props.selected ? props.theme.color || theme.primary : ''};
  color: ${(props) => props.selected ? theme.white : theme.primary};
  display: flex;
  padding: 0.2rem 0.7rem;
  font-size: 16px;

  &:hover {
    cursor: pointer;
  }
`;
