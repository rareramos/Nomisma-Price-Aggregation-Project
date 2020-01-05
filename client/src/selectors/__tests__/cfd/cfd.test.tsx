import { IState } from 'types/reducers';
import {
  ICfdFormState,
  ICfdState,
  IQuasiLiveState,
} from 'types/reducers/cfd';
import {
  TCfdSettingItemList,
} from 'types/utils';

import {
  selectCfdFromState,
  selectAvailableMarkers,
  selectQuasiLive,
  selectCfdFormDataFromState,
  selectCvaFvaItems,
} from 'selectors/cfd';


describe('cfd Selectors', () => {
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
  };

  it('should return cfd state', () => {
    const mockCfdFromState : ICfdState = state.cfd;
    const selected = selectCfdFromState(state);
    expect(selected).toEqual(mockCfdFromState);
  });

  it('should return available markers', () => {
    const mockCfdMarketsFromState : Array<string> = state.cfd.availableMarkets;
    const selected = selectAvailableMarkers(state);
    expect(selected).toEqual(mockCfdMarketsFromState);
  });

  it('should return Quasi live data', () => {
    const mockCfdQuasiLiveFromState : IQuasiLiveState = state.cfd.quasiLive;
    const selected = selectQuasiLive(state);
    expect(selected).toEqual(mockCfdQuasiLiveFromState);
  });

  it('should return form data', () => {
    const mockCfdFormData : ICfdFormState = state.cfd.formData;
    const selected = selectCfdFormDataFromState(state);
    expect(selected).toEqual(mockCfdFormData);
  });

  it('should return Cva Fva Items', () => {
    const mockCvaSettingItems : TCfdSettingItemList = [{
      item: {
        abbrKey: 'Default',
        value: 'Default',
      },
      key: 'Default',
      onSelectChange: () => jest.fn,
    },
    {
      item: {
        abbrKey: 'Tailored',
        value: 'Tailored',
      },
      key: 'Tailored',
      onSelectChange: () => jest.fn,
    },
    ];
    const selected = selectCvaFvaItems();
    expect(JSON.stringify(selected)).toEqual(JSON.stringify(mockCvaSettingItems));
  });
});
