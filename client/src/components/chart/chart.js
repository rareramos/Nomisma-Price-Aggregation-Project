import React, { Component } from 'react';
import {
  arrayOf, func, string, bool,
  shape, instanceOf, number,
} from 'prop-types';
import { StrikeChart } from '@nomisma/nomisma-ui/charts/strike-chart';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { Period } from './period';
import { Source } from './source';
import { Currencies } from './currency';
import { Compare } from './compare';

export class ChartView extends Component {
  static capitalize(stringValue) {
    return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
  }

  componentWillMount() {
    const {
      period, fetchChartData,
    } = this.props;

    fetchChartData('all', period);
  }

  render() {
    const {
      compare,
      loading,
      currency,
      protocol,
      chartData,
      chartDataSecondary,
    } = this.props;
    return (
      <div>
        <Grid
          column="160px 328px 196px"
          columnGap="256px"
        >
          <Currencies />
          <Source />
          <Period />
        </Grid>
        <StrikeChart
          id="chartdiv"
          data={chartData}
          width="100%"
          height="400px"
          currency={currency.toUpperCase()}
          hideFunctions
          loading={loading}
          dataName={compare ? 'Compound' : ChartView.capitalize(protocol)}
          secondaryDataSet={chartDataSecondary}
          secondaryDataName={chartDataSecondary.length > 0 && 'Dharma'}
        />
        <Grid
          column="auto 100px"
        >
          <Grid
            column="90px 50px"
          >
            <div>Comapare:</div>
            <Compare />
          </Grid>
        </Grid>
      </div>
    );
  }
}

ChartView.defaultProps = {
  chartData: [],
  chartDataSecondary: [],
  protocol: 'all',
  period: '24h',
  loading: true,
  currency: 'usd',
  compare: false,
};

ChartView.propTypes = {
  fetchChartData: func.isRequired,
  chartData: arrayOf(shape({ date: instanceOf(Date), value: number })),
  chartDataSecondary: arrayOf(shape({ date: instanceOf(Date), value: number })),
  protocol: string,
  period: string,
  loading: bool,
  currency: string,
  compare: bool,
};
