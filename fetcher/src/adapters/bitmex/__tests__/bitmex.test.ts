import { Bitmex } from '../bitmex';
import { getDummyLiveTickDataEvent, tickDummyData } from './mock-utils/data-objects';
import { setDbEnvironment } from '../../../utils/common';
import { ISinkData } from '../../../types/adapters/publisher';

describe('bitmex', () : void => {
  let bitmexAdapter;
  let liveDummyTickData;
  beforeAll(() : void => {
    setDbEnvironment();
    bitmexAdapter = new Bitmex();
    bitmexAdapter.ws = bitmexAdapter.setupWebsocket();
    liveDummyTickData = getDummyLiveTickDataEvent().event;
  });

  it('subscribe and tick instruments data', async (done : () => void) : Promise<void> => {
    bitmexAdapter.symbolsMap = await bitmexAdapter.getSymbolsMap();
    await bitmexAdapter.subscribe();
    const { adapterInstruments: instruments } = bitmexAdapter;
    const liveInstrumentData = Object.keys(instruments).map((instumentskey : string) => {
      const intrumentData = instruments[instumentskey];
      return intrumentData;
    });
    const event = { ...liveDummyTickData, data: liveInstrumentData };
    bitmexAdapter.liveDataHandler = jest.fn((sinkData : ISinkData) : void => {
      const recieved = Object.keys(sinkData);
      const expected = ['symbol', 'serviceName', 'base', 'underlying', 'offer', 'bid'];
      expect(recieved).toEqual(expect.arrayContaining(expected));
      expected.forEach((sinkDataKey : string) : void => {
        expect(sinkData[sinkDataKey]).not.toBeFalsy();
      });
      done();
    });
    await bitmexAdapter.tick({ event });
  });

  it('getInstruments(): must return all keys of response object', async (done : () => void) : Promise<void> => {
    const result = await bitmexAdapter.getInstruments();
    let resultKeys : Array<string> = [];
    Object.keys(result).forEach((key : string) : void => {
      resultKeys = Object.keys(result[key]);
    });
    expect(resultKeys).toEqual(Object.keys(tickDummyData()));
    done();
  });
});
