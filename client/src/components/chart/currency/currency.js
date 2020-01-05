import React from 'react';
import {
  func, arrayOf, shape, string,
} from 'prop-types';
import { ChartTabs } from '../../common/chart-tabs';
import { currencies as currenciesMock } from '../../../utils/chart';

export const CurrenciesComp = ({ currencies, selectedSource, onClick }) => (
  <ChartTabs
    selected={selectedSource}
    setActiveNavItem={value => onClick(value)}
    navItems={currencies}
  />
);

CurrenciesComp.defaultProps = {
  currencies: currenciesMock,
};

CurrenciesComp.propTypes = {
  selectedSource: string.isRequired,
  currencies: arrayOf(shape({ title: string, type: string })),
  onClick: func.isRequired,
};
