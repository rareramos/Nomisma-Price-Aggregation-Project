import React, { ReactElement } from 'react';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { IPreferencesProps } from 'types/components/cfd';
import { TailoredSettings } from '../tailored-settings';
import {
  PreferencesWrapper,
  Wrapper,
  Label,
  StyledInputBox,
  InputWrapper,
  PageHeader,
  BrokerOptionWrapper,
} from './styled';
import { SimpleDropDownWithLabel } from '../../../common/simple-dropdown-label';

export const Preferences = ({
  currencyPairs,
  currencyPairsItems,
  cvaFva,
  cvaFvaItems,
  futureContract,
  futureContractItems,
  holdingPeriod,
  marketUpdateParameters,
} : IPreferencesProps) : ReactElement => (
  <PreferencesWrapper>
    <Wrapper>
      <PageHeader>
        <div>Preferences</div>
        <div>
          <button
            className="btn btn-success"
            type="button"
            onClick={marketUpdateParameters}
          >
            Update parameters
          </button>
        </div>
      </PageHeader>
      <hr />
      <Grid
        column="1fr 1fr 1fr"
        columnGap="1em"
      >
        <SimpleDropDownWithLabel
          label="Currency Pair"
          selectedItem={currencyPairs}
          dropdownItems={currencyPairsItems}
        />
        <SimpleDropDownWithLabel
          label="Contract"
          selectedItem={futureContract}
          dropdownItems={futureContractItems}
        />
        { futureContract === 'Perpetual' && (
          <InputWrapper>
            <Label>Hold on Spot/Perpetual position</Label>
            <StyledInputBox
              type="number"
              unit="DAYS"
              defaultValue={holdingPeriod}
              disabled={false}
              invalid={false}
            />
          </InputWrapper>
        ) }
      </Grid>
      <hr />
      <Grid
        column="1fr 1fr 1fr"
        columnGap="1em"
      >
        <SimpleDropDownWithLabel
          label="CVA & FVA Settings"
          selectedItem={cvaFva}
          dropdownItems={cvaFvaItems}
        />
        <SimpleDropDownWithLabel
          label="View on Broker's Credit"
          selectedItem={futureContract}
          dropdownItems={futureContractItems}
        />
      </Grid>
      <hr />
      <BrokerOptionWrapper>
        <SimpleDropDownWithLabel
          label="View on Broker's Credit"
          selectedItem={futureContract}
          dropdownItems={futureContractItems}
        />
      </BrokerOptionWrapper>
      <TailoredSettings />
    </Wrapper>
  </PreferencesWrapper>
);
