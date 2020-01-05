import React, { Component } from 'react';
import { array, func, string, bool } from 'prop-types';
import { StrikeChart } from '@nomisma/nomisma-ui/charts/strike-chart';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { Period } from './period';
import { Source } from './source';
import { Currencies } from './currency';
import { Compare } from './compare';

export class ChartView extends Component {
  componentWillMount() {
    const {
      period,
    } = this.props;
    this.props.fetchChartData('all', period);
  }

  Capitilize(stringValue) {
    return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
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
          column='160px 223px 200px'
          columnGap='25%'
        >
          <Currencies/>
          <Source/>
          <Period/>
        </Grid>
        <StrikeChart
          id='chartdiv'
          data={ chartData }
          width='100%'
          height='400px'
          currency={ currency.toUpperCase() }
          hideFunctions
          loading={ loading }
          dataName={ compare ?  'Compound' : this.Capitilize(protocol) }
          secondaryDataSet={ chartDataSecondary }
          secondaryDataName={ this.props.chartDataSecondary.length > 0 && 'Dharma' }
        />
        <Grid
          column='auto 100px'
        >
          <Grid
            column='90px 50px'
          >
            <div>Comapare:</div>
            <Compare/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ChartView.propTypes = {
  fetchChartData: func.isRequired,
  chartData: array,
  chartDataSecondary: array,
  protocol: string,
  period: string,
  loading: bool,
  currency: string,
  compare: bool,
};
