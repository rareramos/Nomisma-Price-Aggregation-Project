import React from 'react';
import { func, array, string } from 'prop-types';
import { ChartTabs } from '../../common/chart-tabs';

export const Period = ({ periods, selectedSource, onClick }) => (
  <ChartTabs
    selected={ selectedSource }
    setActiveNavItem={ value => onClick(value) }
    navItems={ periods }
  />
);

Period.propTypes = {
  selectedSource: string.isRequired,
  periods: array,
  onClick: func.isRequired,
};
