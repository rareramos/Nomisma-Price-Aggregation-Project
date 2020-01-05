import styled from 'styled-components';
import {
  Button,
} from '@nomisma/nomisma-ui/button';
import { ellipsis } from 'polished';

export const ButtonLeft = styled(Button)`
  margin-right: 1rem;
`;

export const SelectedItems = styled.div`
  max-width: ${props => ellipsis(props.maxWidth || '10.8rem')};
  font-size: 14px;
  margin-right: 0.1rem;
`;
