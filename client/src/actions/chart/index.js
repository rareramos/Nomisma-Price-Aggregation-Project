import {
  CHART_FETCH,
  CHART_SAVE,
  CHART_ERROR,
  CHART_LOADING_TOGGLE,
  CHART_PERIOD_UPDATE,
  CHART_PERIOD_SAVE,
  CHART_SOURCE_UPDATE,
  CHART_SOURCE_SAVE,
  CHART_CURRENCY_UPDATE,
  CHART_CURRENCY_SAVE,
  CHART_COMPARE_SAVE,
  CHART_COMPARE_UPDATE,
  CHART_SECONDARY_FETCH,
  CHART_SECONDARY_SAVE,
} from '../types';

export const fetchChartData = (protocol, value) => {
  return {
    type: CHART_FETCH,
    data: { protocol, value },
  };
};

export const fetchChartSuccess = (data) => {
  return {
    type: CHART_SAVE,
    data,
  };
};

export const fetchChartDataSecondary = (protocol, value) => {
  return {
    type: CHART_SECONDARY_FETCH,
    data: { protocol, value },
  };
};

export const fetchChartDataSecondarySuccess = (data) => {
  return {
    type: CHART_SECONDARY_SAVE,
    data,
  };
};

export const fetchChartError = (data) => ({
  type: CHART_ERROR,
  data,
});

export const toggleChartLoading = () => ({
  type: CHART_LOADING_TOGGLE,
});

export const updateChartPeriod = (data) => ({
  type: CHART_PERIOD_UPDATE,
  data,
});

export const saveChartPeriod = (data) => ({
  type: CHART_PERIOD_SAVE,
  data,
});

export const updateChartSource = (data) => ({
  type: CHART_SOURCE_UPDATE,
  data,
});

export const saveChartSource = (data) => ({
  type: CHART_SOURCE_SAVE,
  data,
});

export const updateChartCurrency = (data) => ({
  type: CHART_CURRENCY_UPDATE,
  data,
});

export const saveChartCurrency = (data) => ({
  type: CHART_CURRENCY_SAVE,
  data,
});

export const updateChartCompare = (data) => ({
  type: CHART_COMPARE_UPDATE,
  data,
});

export const saveChartCompare = (data) => ({
  type: CHART_COMPARE_SAVE,
  data,
});


