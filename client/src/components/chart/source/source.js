import React from 'react';
import {
  func, arrayOf, shape, string,
} from 'prop-types';
import { ChartTabs } from '../../common/chart-tabs';
import { sources as sourcesMock } from '../../../utils/chart';

export const SourceComp = ({ sources, selectedSource, onClick }) => (
  <ChartTabs
    selected={selectedSource}
    setActiveNavItem={value => onClick(value)}
    navItems={sources}
  />
);

SourceComp.defaultProps = {
  sources: sourcesMock,
};
SourceComp.propTypes = {
  selectedSource: string.isRequired,
  sources: arrayOf(shape({ title: string, type: string })),
  onClick: func.isRequired,
};
