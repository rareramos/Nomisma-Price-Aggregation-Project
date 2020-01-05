import React from 'react';

import { Switcher } from '../switcher';
import { TokenSelectorContainer } from '../token-selector';
import { Grid } from '@nomisma/nomisma-ui/grid';

export const TableToolbar = () => {
  return (
    <Grid column='1fr 1fr 1fr'>
      <div/>
      <Switcher/>
      <div style={{ alignSelf: 'center', justifySelf: 'end' }}>
        <TokenSelectorContainer/>
      </div>
    </Grid>
  );
};
