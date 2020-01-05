import { IState } from 'types/reducers';
import { IChartFilter } from 'types/utils';

import {
  selectChartPeriodsSelector,
  selectPeriodFromState,
  selectChartSourcesSelector,
  selectChartSourceFromState,
  selectChartCurrenciesSelector,
  selectChartCurrencyFromState,
  selectChartComapreFromState,
} from 'selectors/chart';

import { selectChartLoadingSelector } from 'selectors/chart/loading';

describe('chart selectors', () => {
  const state : IState = {
    cfd: {
      formData: {
        bitmex: 10,
        currencyPairs: 'BTC/USD',
        cvaFva: 'Default',
        deribit: 25,
        futureContract: 'Perpetual',
        kraken: 20,
        okex: 15,
        positionPeriod: 1,
        brokersCreditCVA: 'Probability Of Default',
        columnsData: [{
          columnName: 'Platform',
          key: 'platform',
          enabled: true,
          selector: item => item.platform,
        }],
      },
      availableMarkets: [
        'BTC-USD',
        'XRP-BTC',
        'BCH-BTC',
        'ETH-USD',
        'ADA-BTC',
        'EOS-BTC',
        'TRX-BTC',
      ],
      marketData: {
        Bitmex: {
          base: 'BTC',
          bid: 8414,
          offer: 8414.5,
          serviceName: 'Bitmex',
          symbol: 'BTC/USD - Perpetual',
          underlying: 'USD',
        },
      },
      quasiLive: {
        'ADA/BTC - Sep19': {
          'bitmex.com': [
            {
              base: 'ADA',
              bid: 0.00000457,
              classification: 'Pair',
              contract: 'Sep19',
              expiry: '2019-09-27',
              fundingLong: 0,
              fundingShort: 0,
              makerFee: 0.05,
              margin: 5,
              marginCcy: 'BTC',
              name: 'ADA/BTC',
              offer: 0.00000458,
              serviceName: 'bitmex.com',
              symbol: 'ADA/BTC - Sep19',
              takerFee: -0.25,
              underlying: 'BTC',
            },
          ],
        },
      },
      selectedMarket: null,
      socket: {
        socket: null,
        channel: null,
      },
      marketUpdateParameters: null,
    },
    instruments: {
      quasiLive: {},
      scraping: {},
      unmatched: {},
    },
    topTab: 'cfd',
    chart: {
      compare: false,
      loading: true,
      currency: 'usd',
      period: '86400',
      source: 'all',
    },
  };

  it('should return chart period from state', () => {
    const mockChartPeriodFromState : string = state.chart.period;
    const selected = selectPeriodFromState(state);
    expect(selected).toEqual(mockChartPeriodFromState);
  });

  it('should return chart source from state', () => {
    const mockChartSourceFromState : string = state.chart.source;
    const selected = selectChartSourceFromState(state);
    expect(selected).toEqual(mockChartSourceFromState);
  });

  it('should return chart currency from state', () => {
    const mockChartCurrencyFromState : string = state.chart.currency;
    const selected = selectChartCurrencyFromState(state);
    expect(selected).toEqual(mockChartCurrencyFromState);
  });

  it('should return chart compare from state', () => {
    const mockChartCompareFromState : boolean = state.chart.compare;
    const selected = selectChartComapreFromState(state);
    expect(selected).toEqual(mockChartCompareFromState);
  });

  it('should return chart loading from state', () => {
    const mockChartLoadingFromState : boolean = state.chart.loading;
    const selected = selectChartLoadingSelector(state);
    expect(selected).toEqual(mockChartLoadingFromState);
  });

  it('should return chart periods', () => {
    const mockChartPeriods : IChartFilter = { title: '24h', type: '86400' };
    const selected = selectChartPeriodsSelector();
    expect(selected).toContainEqual(mockChartPeriods);
  });

  it('should return chart sources', () => {
    const mockChartSources : IChartFilter = { title: 'All', type: 'all' };
    const selected = selectChartSourcesSelector();
    expect(selected).toContainEqual(mockChartSources);
  });

  it('should return chart currencies', () => {
    const mockChartCurrencies : IChartFilter = { title: 'USD', type: 'usd' };
    const selected = selectChartCurrenciesSelector();
    expect(selected).toContainEqual(mockChartCurrencies);
  });
});
