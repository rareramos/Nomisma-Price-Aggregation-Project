import React, { Fragment, ReactElement } from 'react';
import { Radio, useRadio } from '@nomisma/nomisma-ui/form/radio';
import { InfoIcon, Label, OptionsWrapper } from '../../styled';


export const CorrelationsOption = () : ReactElement => {
  const { getRadioProps } = useRadio({
    name: 'fva-correlations',
  });
  return (
    <Fragment>
      <Label>Use default correlations?</Label>
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
    </Fragment>
  );
};
