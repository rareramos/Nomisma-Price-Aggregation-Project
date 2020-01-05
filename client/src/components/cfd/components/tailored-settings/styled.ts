import styled from 'styled-components';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { Button } from '@nomisma/nomisma-ui/button';
import { IconInfoCircle } from '@nomisma/nomisma-ui/icons';
import { InputBox } from '@nomisma/nomisma-ui/form/input-box';
import { cssVar } from '@nomisma/nomisma-ui/styled-app';

export const Wrapper = styled.div`
  margin: 10px;
`;

export const Heading = styled.h2`
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  margin-bottom: 18px;
`;

export const Body = styled.div``;

export const ButtonWrapper = styled.div`
  width: 100%;
`;

export const SubHeading = styled.h3`
  color: ${props => props.theme.text};
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`;

export const SubWrapper = styled.div`
  border-left: 1px solid ${props => props.theme.bgLight};
  color: ${props => props.theme.text};
  font-size: 12px;
  font-weight: normal;
  line-height: 14px;
  min-height: 360px;
  padding: 0 16px;
  &:first-child {
    border: none;
  }
`;

export const GridWrapper = styled(Grid)`
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
`;

/* stylelint-disable block-no-empty */
export const Label = styled.label`
`;

export const StyledButton = styled(Button)`
  font-size: 12px;
  line-height: 20px;
  margin-right: 20px;
  max-width: 132px;
  width: 100%;
  padding: 2px 20px;
`;

export const OptionsWrapper = styled.div`
  label {
    display: inline-block;
    font-size: 12px;
    font-weight: normal;
    line-height: 20px;
    margin-right: 40px;
    &:first-child {
      margin-right: 36px;
    }
  }
`;

export const InfoIcon = styled(IconInfoCircle)``;

export const ModalTab = styled.div`
  width: '30rem';
  height: '100vh';
`;

export const StyledInputBox = styled(InputBox)`
  width: 3em;
  text-align: center;
`;
export const CollapseToggle = styled.div({
  fontSize: 14,
  color: cssVar('textSecondary'),
  margin: '0.75rem 0',
  cursor: 'pointer',
});
