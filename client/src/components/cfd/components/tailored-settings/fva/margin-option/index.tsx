import React, { Fragment, ReactElement } from 'react';
import { Radio, useRadio } from '@nomisma/nomisma-ui/form/radio';
import { InfoIcon, Label, OptionsWrapper } from '../../styled';


export const MarginOption = () : ReactElement => {
  const { getRadioProps } = useRadio({
    name: 'fva-margin',
  });
  return (
    <Fragment>
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
    </Fragment>
  );
};
