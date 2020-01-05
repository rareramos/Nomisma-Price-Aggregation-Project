import io, { Socket } from 'socket.io';
import crypto from 'crypto';

import environment from '../environment';
import { log } from './utils/logger';
import {
  ISinkData, ISubscribersByMarketHash, ICurrencyPairHash, IMarketsData, ICache, IMarketUpdatedData,
} from './types';

const getNewSocketId = () : string => crypto.randomBytes(16).toString('hex');

const DEFAULT_MARKET = 'BTC/USD - Perpetual';

const updateToMarketName = (payload : ISinkData) : string => payload.symbol || `${payload.base}/${payload.underlying}`;

const logAgent = (socket : Socket, type : string) : void => {
  let connectionDetails = '';
  if (
    !!socket.handshake
    && !!socket.handshake.headers
    && !!socket.handshake.headers['user-agent']
  ) {
    connectionDetails = socket.handshake.headers['user-agent'];
  }

  log.info({
    message: `New ${type}: ${connectionDetails}`,
  });
};

const run = () : void => {
  const receive = io(environment.RECEIVE_PORT);
  const pubsub = io(environment.SEND_PORT);
  let publisherSocket : Socket;

  log.info({
    message: `Receiving socket on port: ${environment.RECEIVE_PORT}`,
  });

  log.info({
    message: `Subscription socket on port: ${environment.SEND_PORT}`,
  });

  const subscribersByMarketHash : ISubscribersByMarketHash = {};
  const currencyPairHash : ICurrencyPairHash = {};
  const marketsData : IMarketsData = {};
  let cache : ICache = {};

  pubsub.on('connection', (socket : Socket) : void => {
    logAgent(socket, 'subscriber');
    const id = getNewSocketId();
    // Fallback to the first available market if DEFAULT_MARKET unavailable
    const defaultMarket : string = marketsData[DEFAULT_MARKET]
      ? DEFAULT_MARKET
      : Object.keys(marketsData)[0];
    if (!subscribersByMarketHash[defaultMarket]) {
      subscribersByMarketHash[defaultMarket] = {};
    }
    subscribersByMarketHash[defaultMarket][id] = socket;
    let currentMarket = defaultMarket;

    socket.on('market-select', (payload : { market : string }) : void => {
      if (marketsData[payload.market]) {
        delete subscribersByMarketHash[currentMarket][id];
        if (!subscribersByMarketHash[payload.market]) {
          subscribersByMarketHash[payload.market] = {};
        }
        subscribersByMarketHash[payload.market][id] = socket;
        currentMarket = payload.market;
        socket.emit('market-selected', currentMarket);
        socket.emit('market-data-bulk', marketsData[currentMarket]);
      }
    });

    socket.on('market-update-parameters', (payload) => {
      publisherSocket.emit('market-update-parameters', payload);
    });
    socket.on('disconnect', () : void => {
      delete subscribersByMarketHash[currentMarket][id];
    });
    socket.emit('available-markets', Object.keys(currencyPairHash));
    socket.emit('market-selected', currentMarket);
    socket.emit('market-data-bulk', marketsData[currentMarket]);
  });

  receive.on('connection', (socket : Socket) : void => {
    publisherSocket = socket;
    logAgent(publisherSocket, 'publisher');


    publisherSocket.on('hello', (payload : ISinkData) : void => {
      log.info({
        message: `Hello from ${payload.serviceName} service`,
      });
    });

    publisherSocket.on('update', (payload : ISinkData) : void => {
      const marketName = updateToMarketName(payload);
      const currencyPair = `${payload.base}/${payload.underlying}`;

      log.debug({
        message: `Price update from ${payload.serviceName} for market ${marketName}`,
      });

      if (!marketsData[marketName]) {
        marketsData[marketName] = {};
      }
      if (!currencyPairHash[currencyPair]) {
        currencyPairHash[currencyPair] = true;
      }

      const updateObject : IMarketUpdatedData = {
        [payload.serviceName]: {
          symbol: marketName,
          bid: payload.bid,
          offer: payload.offer,
        },
      };

      marketsData[marketName][payload.serviceName] = payload;
      if (!cache[marketName]) {
        cache[marketName] = [updateObject];
      } else {
        cache[marketName].push(updateObject);
      }
    });

    publisherSocket.on('market-updated-parameters', (instruments) => {
      Object.keys(instruments).forEach((marketName) : void => {
        let subscribers : Array<Socket> = [];
        if (subscribersByMarketHash[marketName]) {
          subscribers = Object.values(subscribersByMarketHash[marketName]);
        }
        subscribers.forEach(
          // eslint-disable-next-line no-loop-func
          (subscriber) => {
            const instrument = instruments[marketName];
            subscriber.emit('market-data-all', { [instrument.serviceName]: instrument });
          },
        );
      });
    });
  });

  setInterval(() : void => {
    Object.keys(cache).forEach((marketName) : void => {
      let subscribers : Array<Socket> = [];
      if (subscribersByMarketHash[marketName]) {
        subscribers = Object.values(subscribersByMarketHash[marketName]);
      }

      subscribers.forEach(
        // eslint-disable-next-line no-loop-func
        (subscriber : Socket) : void => {
          subscriber.emit('market-data-update', cache[marketName]);
        },
      );
    });
    cache = {};
  }, 500);
};

export default run;
