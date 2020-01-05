import fetch from 'node-fetch';
import * as queryString from 'query-string';

import { Deribit } from '../deribit';
import { ISinkData } from '../../../types/adapters/publisher';
import { IDeribitInstruments } from '../../../types/adapters/deribit';
import {
  setDbEnvironment, getSinkParams, getRandomNumber, getRandomString,
} from '../../../utils/common';
import { deribit } from '../../../../environment';

describe('deribit test', () : void => {
  let deribitInstance;
  let instruments;
  beforeAll(async () : Promise<void> => {
    setDbEnvironment();
    deribitInstance = new Deribit();
    deribitInstance.ws = deribitInstance.setupWebsocket();
    const requestQuery = queryString.stringify({ currency: 'BTC', kind: 'future', expiry: false });
    const deribitInstrumentsAPI = `${deribit.DERIBIT_BASE_URL}/public/get_instruments?${requestQuery}`;
    const response = await fetch(deribitInstrumentsAPI);
    instruments = await response.json();
  });

  it('liveDataHandler()', async (done : () => void) : Promise<void> => {
    const liveDataHandler = (sinkData : ISinkData) : void => {
      const recieved = Object.keys(sinkData);
      const expected = getSinkParams();
      expect(recieved).toEqual(expect.arrayContaining(expected));
      expected.forEach((sinkDataKey : string) : void => {
        expect(sinkData[sinkDataKey]).not.toBeFalsy();
      });
      done();
    };
    deribitInstance.setLiveDataHandler(liveDataHandler);
    const { result: [liveEventData] } = instruments;
    // eslint-disable-next-line @typescript-eslint/camelcase
    liveEventData.best_bid_price = getRandomNumber();
    // eslint-disable-next-line @typescript-eslint/camelcase
    liveEventData.best_ask_price = getRandomNumber();
    deribitInstance.adapterInstruments = { [liveEventData.instrument_name]: liveEventData };
    deribitInstance.prevBidAsk = { [liveEventData.instrument_name]: liveEventData };
    instruments.result.forEach((i : IDeribitInstruments) : void => {
      deribitInstance.symbolsMap[i.instrument_name] = {
        serviceName: getRandomString(),
        serviceSymbol: i.instrument_name,
        classification: getRandomString(),
        contract: getRandomString(),
        name: getRandomString(),
        symbol: i.instrument_name,
      };
    });
    deribitInstance.tick({ event: { params: { data: liveEventData }, method: 'subscription' } });
  });
});
