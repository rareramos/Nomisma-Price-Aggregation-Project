import React from 'react';
import { func, array, string } from 'prop-types';
import { ChartTabs } from '../../common/chart-tabs';

export const SourceComp = ({ sources, selectedSource, onClick }) => (
  <ChartTabs
    selected={ selectedSource }
    setActiveNavItem={ value => onClick(value) }
    navItems={ sources }
  />
);

SourceComp.propTypes = {
  selectedSource: string.isRequired,
  sources: array,
  onClick: func.isRequired,
};
