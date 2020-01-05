import * as React from 'react';
import { shallow } from 'enzyme';

import { ComapreComp } from 'components/chart/compare/compare';
import { CurrenciesComp } from 'components/chart/currency/currency';
import { Period } from 'components/chart/period/period';
import { SourceComp } from 'components/chart/source/source';
import { ChartView } from 'components/chart/chart';
import { currencies, periods, sources } from 'utils';
import {
  IChartCompareProps,
  IChartCurrenciesProps,
  IChartPeriodProps,
  IChartSourceProps,
  IChartViewProps,
} from 'types/components/chart';

const CompareChartProps : IChartCompareProps = {
  isInComapreMode: false,
  onClick: jest.fn,
};

const CurrencyChartProps : IChartCurrenciesProps = {
  currencies,
  onClick: jest.fn,
  selectedSource: 'usd',
};

const SourceChartProps : IChartSourceProps = {
  onClick: jest.fn,
  selectedSource: 'usd',
  sources,
};

const PeriodChartProps : IChartPeriodProps = {
  onClick: jest.fn,
  periods,
  selectedSource: 'usd',
};

const ChartViewProps : IChartViewProps = {
  chartData: [],
  chartDataSecondary: [],
  compare: false,
  currency: 'usd',
  fetchChartData: jest.fn,
  period: '86400',
  protocol: 'all',
};

describe('chart tests', () => {
  it('matches compare snapshot', () => {
    const wrapper = shallow(<ComapreComp {...CompareChartProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches currency snapshot', () => {
    const wrapper = shallow(<CurrenciesComp {...CurrencyChartProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches source snapshot', () => {
    const wrapper = shallow(<SourceComp {...SourceChartProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches period snapshot', () => {
    const wrapper = shallow(<Period {...PeriodChartProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches chart view snapshot', () => {
    const wrapper = shallow(<ChartView {...ChartViewProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
