import React from 'react';

import { Grid } from '@nomisma/nomisma-ui/grid';
import { Switcher } from '../switcher';
import { TokenSelectorContainer } from '../token-selector';

export const TableToolbar = () => (
  <Grid column="1fr 2fr 1fr">
    <div />
    <Switcher />
    <div style={{ alignSelf: 'center', justifySelf: 'end' }}>
      <TokenSelectorContainer />
    </div>
  </Grid>
);
