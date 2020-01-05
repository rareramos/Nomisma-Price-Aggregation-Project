import React, { Component, ReactNode } from 'react';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { ICfdProps } from 'types/components/cfd';
import { CfdTable } from './cfd-table-container';
import { Preferences } from './components/preferences/preferences-container';

export class Cfd extends Component<ICfdProps> {
  public componentDidMount() : void {
    const { startQuasiLiveFetch } = this.props;
    startQuasiLiveFetch();
  }

  public render() : ReactNode {
    return (
      <Grid
        column="1fr 10fr 1fr"
      >
        <div />
        <div>
          <Preferences />
          <CfdTable />
        </div>
        <div />
      </Grid>
    );
  }
}
