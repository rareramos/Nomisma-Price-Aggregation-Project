import React, { ReactElement } from 'react';

import { Radio, useRadio } from '@nomisma/nomisma-ui/form/radio';
import { InputBox } from '@nomisma/nomisma-ui/form/input-box';

import {
  SubHeading,
  SubWrapper,
  GridWrapper,
  Label,
  StyledButton,
  ButtonWrapper,
  InfoIcon,
  OptionsWrapper,
} from '../styled';
import { InputWrapper } from './styled';

export const Cva = () : ReactElement => {
  const { getRadioProps } = useRadio({
    name: 'cva-crossmargin',
  });
  return (
    <SubWrapper>
      <SubHeading>CVA</SubHeading>
      <GridWrapper>
        <Label>Variation Margin</Label>
        <InputWrapper>
          <InputBox
            type="text"
            unit="%"
          />
          <InfoIcon />
        </InputWrapper>
        <Label>Credit Default Swap</Label>
        <ButtonWrapper>
          <StyledButton
            btnType="SECONDARY"
          >
            View
          </StyledButton>
          <InfoIcon />
        </ButtonWrapper>
        <Label>Recovery upon Default</Label>
        <ButtonWrapper>
          <StyledButton
            btnType="SECONDARY"
          >
            View
          </StyledButton>
          <InfoIcon />
        </ButtonWrapper>
        <Label>Assume Cross Margining?</Label>
        <OptionsWrapper>
          <Radio
            label="Yes"
            {...getRadioProps(0)}
          />
          <Radio
            label="No"
            {...getRadioProps(1)}
          />
          <InfoIcon />
        </OptionsWrapper>
      </GridWrapper>
    </SubWrapper>
  );
};
