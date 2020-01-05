import io from 'socket.io-client';
import { random } from 'faker';

import run from '../index';
import { ISinkData, IMarketBulkData } from '../types';
import environment from '../../environment';

describe('Publisher test', () : void => {
  let reciever : SocketIOClient.Socket;
  let pubsub : SocketIOClient.Socket;

  const payload : ISinkData = {
    symbol: random.word(),
    serviceName: random.word(),
    base: random.word(),
    underlying: random.word(),
    bid: random.number(),
    offer: random.number(),
  };
  const WS_URL = 'ws://localhost';

  const connectPublisher = () : Promise<void> => new Promise((resolve : () => void) : void => {
    reciever = io.connect(`${WS_URL}:${environment.RECEIVE_PORT}`);
    reciever.on('connect', () : void => {
      reciever.emit('update', payload);
      resolve();
    });
  });

  const connectPubSub = () : Promise<void> => new Promise((resolve : () => void) : void => {
    pubsub = io.connect(`${WS_URL}:${environment.SEND_PORT}`);
    pubsub.on('connect', () : void => {
      pubsub.emit('market-select', { market: payload.symbol });
      resolve();
    });
  });

  beforeAll(() : void => {
    run();
  });

  beforeEach(async (done : () => void) : Promise<void> => {
    await connectPublisher();
    await connectPubSub();
    done();
  });

  afterEach((done : () => void) : void => {
    if (reciever.connected) {
      reciever.disconnect();
    }
    if (pubsub.connected) {
      pubsub.disconnect();
    }
    done();
  });

  test('market selected event', (done : () => void) => {
    pubsub.on('market-selected', (selectedMarket : string) => {
      expect(selectedMarket).toEqual(payload.symbol);
      done();
    });
  });

  test('available-markets event', (done : () => void) : void => {
    pubsub.on('available-markets', (result : Array<string>) => {
      expect(result).toEqual([`${payload.base}/${payload.underlying}`]);
      done();
    });
  });

  test('market-data-bulk event', (done : () => void) : void => {
    pubsub.on('market-data-bulk', (result : IMarketBulkData) => {
      expect(result).toEqual({ [payload.serviceName]: payload });
      done();
    });
  });

  test('update market data test', (done : () => void) : void => {
    pubsub.on('market-data-update', (result : Array<ISinkData>) => {
      const expected = {
        [payload.serviceName]: {
          bid: payload.bid, offer: payload.offer, symbol: payload.symbol,
        },
      };
      const [received] = result;
      expect(received).toEqual(expected);
      done();
    });
  });
});
