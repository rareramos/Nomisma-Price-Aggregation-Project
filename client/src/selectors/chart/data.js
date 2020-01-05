import { selectChartFromState } from './index';

export const selectChartDataFromState = state => selectChartFromState(state).data;

export const selectDisplayChartRecordsFromState = state => selectChartDataFromState(state)
  .map(item => ({
    date: new Date(item.timestamp * 1000),
    value: item.totalValueUsd,
  }));


export const selectChartDataSecondaryFromState = state => selectChartFromState(state).dataSecondary;

export const selectDisplayChartSecondaryRecordsFromState = state => selectChartDataSecondaryFromState(state)
  .map(item => ({
    date: new Date(item.timestamp * 1000),
    value: item.totalValueUsd,
  }));
