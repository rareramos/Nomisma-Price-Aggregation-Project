import fetch from 'node-fetch';

import { Kraken } from '../kraken';
import { getSinkParams } from '../../../utils/common';
import { ISinkData } from '../../../types/adapters/publisher';
import { kraken } from '../../../../environment';

describe('Kraken test', () : void => {
  let krakenInstance;
  let liveTickersData;
  const instrumentsKeys = ['tag', 'pair', 'symbol', 'markPrice', 'bid', 'bidSize', 'ask', 'askSize', 'vol24h',
    'openInterest', 'open24h', 'last', 'lastTime'];

  beforeAll(async () : Promise<void> => {
    krakenInstance = new Kraken();
    krakenInstance.ws = krakenInstance.setupWebsocket();
    const result = await fetch(kraken.KRAKEN_INSTRUMENTS);
    liveTickersData = await result.json();
  });

  test('tick()', async (done : () => void) : Promise<void> => {
    const publisher = (sinkData : ISinkData) : void => {
      const recieved = Object.keys(sinkData);
      const expected = getSinkParams();
      expect(recieved).toEqual(expect.arrayContaining(expected));
      expected.forEach((sinkDataKey : string) : void => {
        expect(sinkData[sinkDataKey]).not.toBeFalsy();
      });
      done();
    };
    const { tickers: [tickData] } = liveTickersData;
    const { symbol } = tickData;
    krakenInstance.adapterInstruments = { [symbol]: { ...tickData } };
    krakenInstance.symbolsMap = { [symbol]: { ...tickData } };
    krakenInstance.setLiveDataHandler(publisher);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await krakenInstance.tick({ event: { feed: 'ticker', product_id: symbol, ...tickData } });
  });

  test('getInstruments()', async (done : () => void) : Promise<void> => {
    const instrumentResult = await krakenInstance.getInstruments();
    const [resultData] = Object.keys(instrumentResult).map((i : string) => instrumentResult[i]);
    expect(Object.keys(resultData)).toEqual(expect.arrayContaining(instrumentsKeys));
    done();
  });
});
