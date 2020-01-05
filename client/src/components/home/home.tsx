import React, { Component, ReactNode } from 'react';
import { IHomeProps } from 'types/components/home';
import { Cfd } from '../cfd';
import { CfdWrapper } from './styled';

export class Home extends Component<IHomeProps> {
  public componentDidMount() : void {
    const { navigateToCFD } = this.props;
    navigateToCFD('cfd');
  }

  public render() : ReactNode {
    return (
      <CfdWrapper>
        <Cfd />
      </CfdWrapper>
    );
  }
}
