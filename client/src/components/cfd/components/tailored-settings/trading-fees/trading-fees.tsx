import React, { ReactElement } from 'react';
import { Radio, useRadio } from '@nomisma/nomisma-ui/form/radio';
import {
  SubHeading, SubWrapper, GridWrapper, Label, InfoIcon,
} from '../styled';
import { InfoWrapper, StyledOptionsWrapper } from './styled';

export const TradingFees = () : ReactElement => {
  const { getRadioProps } = useRadio({
    name: 'trading-fees',
  });
  return (
    <SubWrapper>
      <SubHeading>Trading Fees</SubHeading>
      <GridWrapper>
        <Label>Transact as</Label>
        <StyledOptionsWrapper>
          <Radio
            label="Maker"
            {...getRadioProps(0)}
          />
          <Radio
            label="Taker"
            {...getRadioProps(1)}
          />
          <InfoIcon />
        </StyledOptionsWrapper>
        <InfoWrapper>
          &quote;Maker&quote; has more favorable trading fees
          &ltquo;
          <br />
          &quote;Taker&quote; guarantees the transaction is filled
        </InfoWrapper>
      </GridWrapper>
    </SubWrapper>
  );
};
