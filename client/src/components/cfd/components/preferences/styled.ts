import styled from 'styled-components';
import { InputBox } from '@nomisma/nomisma-ui/form/input-box';

export const PreferencesWrapper = styled.div`
  background-color: var(--white);
  border-radius: 2px;
  box-shadow: 0px 1px 4px var(--bgLight);
  padding: 1em 0 1em 0;
`;

export const Wrapper = styled.div`
  margin: 2em 2em;
`;

export const PageHeader = styled.h4`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

export const Label = styled.label`
  font-size: 0.9em;
`;

export const StyledInputBox = styled(InputBox)`
  flex-basis: 3em;
`;

export const InputWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

export const BrokerOptionWrapper = styled.span`
  float: right;
  width: max-content;
`;
