import https from 'https';
import querystring from 'querystring';
import io from 'socket.io-client';

import environment from '../../../environment';
import { log } from '../../utils/logger';
import setupPublisher from '../publisher';

const {
  fxcm: fxcmConfig,
} = environment;

const token = fxcmConfig.FXCM_TOKEN;

const serviceName = 'fxcm.com';

const apiHost = 'api-demo.fxcm.com';
const apiPort = 443;

let socket;
let globalRequestID = 1;
const requestHeaders = {
  'User-Agent': 'request',
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
};

// https://www.fxcm.com/uk/cryptocurrency/
const FXCM_PAIRS = [
  'BTC/USD',
  'ETH/USD',
  'LTC/USD',
  'BCH/USD',
  'XRP/USD',
];

const getNextRequestID = () => {
  globalRequestID += 1;
  return globalRequestID;
};

const defaultCallback = (statusCode, requestID, data) => {
  if (statusCode === 200) {
    let jsonData;
    try {
      JSON.parse(data);
    } catch (e) {
      log.error({
        message: `request #${requestID} JSON parse error: ${e}`,
      });

      return;
    }

    log.debug({
      message: `request #${requestID} has been executed: ${JSON.stringify(jsonData, null, 2)}`,
    });
  } else {
    log.error({
      message: `request #${requestID} execution error: ${statusCode}: ${data}`,
    });
  }
};

const requestProcessor = (method = 'GET', resource, params, callback = defaultCallback) => {
  const requestID = getNextRequestID();

  // GET HTTP(S) requests have parameters encoded in URL
  const path = method === 'GET' ? `${resource}/?${params}` : resource;
  const req = https.request({
    host: apiHost,
    port: apiPort,
    path,
    method,
    headers: requestHeaders,
  }, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    }); // re-assemble fragmented response data
    response.on('end', () => {
      callback(response.statusCode, requestID, data);
    });
  }).on('error', (err) => {
    callback(0, requestID, err); // this is called when network request fails
  });

  // non-GET HTTP(S) reuqests pass arguments as data
  if (method !== 'GET' && typeof (params) !== 'undefined') {
    req.write(params);
  }
  req.end();
};

const subscribe = (sink, pairs) => {
  requestProcessor('POST', '/subscribe', querystring.stringify({
    pairs,
  }), (statusCode, requestID, data) => {
    if (statusCode === 200) {
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (e) {
        log.error({
          message: `subscribe request ${requestID} JSON parse error: ${e}`,
        });

        return;
      }
      if (jsonData.response.executed) {
        try {
          jsonData.pairs.forEach((pair) => {
            // TODO (jgabuya) rename Symbol
            socket.on(pair.Symbol, (res) => {
              const { Symbol, Rates } = JSON.parse(res);
              const [base, underlying] = Symbol.split('/');

              log.debug({
                message: `FXCM Price update of ${Symbol}`,
              });

              sink({
                serviceName,
                base,
                underlying,
                // Rates: [Bid, Ask, Session High, Session Low]
                bid: Rates[0],
                offer: Rates[1],
              });
            });
          });
        } catch (e) {
          log.error({
            message: `subscribe request #${requestID} pairs JSON parse error: ${e}`,
          });
        }
      } else {
        log.debug({
          message: `subscribe request #${requestID} not executed: ${jsonData}`,
        });
      }
    } else {
      log.error({
        message: `subscribe request #${requestID} execution error: ${statusCode}: ${data}`,
      });
    }
  });
};

const fetchFxcm = async () => {
  const sink = await setupPublisher();

  socket = io(`https://${apiHost}:${apiPort}`, {
    query: querystring.stringify({
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: token,
    }),
  });
  socket.on('connect', () => {
    log.info({
      message: `Socket.IO session has been opened: ${socket.id}`,
    });

    requestHeaders.Authorization = `Bearer ${socket.id}${token}`;

    FXCM_PAIRS.forEach(pair => subscribe(sink, pair));
  });

  socket.on('connect_error', (error) => {
    log.error({
      message: `Socket.IO session connect error: ${error}`,
    });
  });

  socket.on('error', (error) => {
    log.error({
      message: `Socket.IO session error: ${error}`,
    });
  });

  socket.on('disconnect', () => {
    log.info({
      message: 'Socket disconnected, terminating client.',
    });

    process.exit(-1);
  });

  return new Promise(() => {});
};

export default fetchFxcm;
