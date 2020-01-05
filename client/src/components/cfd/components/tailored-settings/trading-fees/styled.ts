import styled from 'styled-components';
import { OptionsWrapper } from '../styled';

export const InfoWrapper = styled.div`
  color: ${props => props.theme.textHint};
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  width: max-content;
`;

export const StyledOptionsWrapper = styled(OptionsWrapper)`
  label {
    margin-right: 32px;
    &:first-child {
      margin-right: 20px;
    }
  }
`;
