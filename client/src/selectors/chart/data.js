import { selectChartFromState } from './index';

export const selectChartDataFromState = state => selectChartFromState(state).data;

export const selectDisplayChartRecordsFromState = (state) => {
  const data = selectChartDataFromState(state);

  return data.map((item) => {
    return {
      date: new Date(item.timestamp * 1000),
      value: item.totalValueUsd,
    };
  });
};

export const selectChartDataSecondaryFromState = state => selectChartFromState(state).dataSecondary;

export const selectDisplayChartSecondaryRecordsFromState = (state) => {
  const data = selectChartDataSecondaryFromState(state);

  return data.map((item) => {
    return {
      date: new Date(item.timestamp * 1000),
      value: item.totalValueUsd,
    };
  });
};
