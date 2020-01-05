import environment from '../../environment';
import { stringify } from 'querystring';
import fetch from 'node-fetch';
import { CMCConvertResult } from 'price-aggregation-db';
import { log } from '../utils/logger';

const {
  COINMARKETCAP_API_URL,
  COINMARKETCAP_API_KEY,
} = environment.thirdParty;

const doCmcRequest = async ({
  symbol,
  convert,
}) => {
  const requestConfig = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  };

  const queryObj = {
    symbol,
    convert,
  };
  const url = `${COINMARKETCAP_API_URL}/cryptocurrency/quotes/latest?${stringify(
    queryObj,
  )}`;
  const response = await fetch(url, requestConfig);
  const result = await response.json();
  return result.data[symbol].quote[convert].price;
};

export const getCurrentConvertRate = async ({
  symbol,
  convert,
}) => {
  const filterId = `${symbol}-${convert}`;
  const items = await CMCConvertResult.find({
    filterId,
  });
  let toReturn;
  if (!!items && !!items.length) {
    // this is too noisy
    // log.info(`Using rate ${symbol}-${convert} from db`);
    toReturn = items[0].payload;
  } else {
    log.info(`Rate for ${symbol}-${convert} not found. fetching`);
    const payload = await doCmcRequest({
      symbol,
      convert,
    });
    log.info(`Saving rate ${symbol}-${convert} = ${payload} to db`);
    await CMCConvertResult.insertOne({
      filterId,
      payload,
    });
    toReturn = payload;
  }
  return toReturn;
};
