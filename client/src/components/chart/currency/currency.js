import React from 'react';
import { func, array, string } from 'prop-types';
import { ChartTabs } from '../../common/chart-tabs';

export const CurrenciesComp = ({ currencies, selectedSource, onClick }) => (
  <ChartTabs
    selected={ selectedSource }
    setActiveNavItem={ value => onClick(value) }
    navItems={ currencies }
  />
);

CurrenciesComp.propTypes = {
  selectedSource: string.isRequired,
  currencies: array,
  onClick: func.isRequired,
};
