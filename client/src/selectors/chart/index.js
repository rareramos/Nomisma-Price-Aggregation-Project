import { periods, sources, currencies } from '../../utils/chart';

export const selectChartFromState = state => state.chart;

export const selectChartPeriodsSelector = () => periods;

export const selectPeriodFromState = state => selectChartFromState(state).period;

export const selectChartSourcesSelector = () => sources;

export const selectChartSourceFromState = state => selectChartFromState(state).source;

export const selectChartCurrenciesSelector = () => currencies;

export const selectChartCurrencyFromState = state => selectChartFromState(state).currency;

export const selectChartComapreFromState = state => selectChartFromState(state).compare;
