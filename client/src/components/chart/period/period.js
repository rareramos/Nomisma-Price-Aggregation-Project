import React from 'react';
import {
  func, arrayOf, shape, string,
} from 'prop-types';
import { ChartTabs } from '../../common/chart-tabs';
import { periods as periodMock } from '../../../utils/chart';

export const Period = ({ periods, selectedSource, onClick }) => (
  <ChartTabs
    selected={selectedSource}
    setActiveNavItem={value => onClick(value)}
    navItems={periods}
  />
);

Period.defaultProps = {
  periods: periodMock,
};
Period.propTypes = {
  selectedSource: string.isRequired,
  periods: arrayOf(shape({ title: string, type: string })),
  onClick: func.isRequired,
};
