import * as httpStatus from 'http-status';
// eslint-disable-next-line import/no-extraneous-dependencies
import { name, address } from 'faker';
import { format, addDays } from 'date-fns';

import attachRequestMeta from '../../utils/common/request';
import { getQuasiLiveData } from '../../../controllers/cfd/quasi-live';
import { preprocessQuasiPrices } from '../../../selectors/cfd';
import { ISuperTestRequest, IQausiLiveProperties } from '../../../types';

describe('CFD integration tests', () : void => {
  describe('CFD API tests', () : void => {
    let request : ISuperTestRequest;
    beforeAll(() : void => {
      request = attachRequestMeta('get');
    });
    test('get all pairs', async () : Promise<void> => {
      const { body: resultData = {}, statusCode } = await request.send('/cfd/quasi', {});
      expect(statusCode).toEqual(httpStatus.OK);
      expect(Object.keys(resultData)).toEqual(expect.arrayContaining(['USD-BTC']));
      expect(resultData).toMatchObject(
        {
          'USD-BTC': {
            Deribit: [{
              serviceName: 'Deribit',
              symbol: 'USD-BTC',
              base: 'ETH',
              classification: 'Pair',
              contract: 'Dec19',
              fundingLong: 0,
              fundingShort: 0,
              makerFee: 0,
              margin: 0,
              marginCcy: 'ETH',
              name: 'ETH/USD',
              takerFee: 0,
              underlying: 'USD',
            }],
          },
        },
      );
    });
    test('with query param symbol', async () : Promise<void> => {
      const { body: resultData = {}, statusCode } = await request.send('/cfd/quasi', {
        query: {
          symbol: 'EOS-XBT',
        },
      });
      expect(statusCode).toEqual(httpStatus.OK);
      expect(Object.keys(resultData)).toEqual(expect.arrayContaining(['EOS-XBT']));
      expect(resultData).toMatchObject(
        {
          'EOS-XBT': {
            Deribit: [{
              serviceName: 'Deribit',
              symbol: 'EOS-XBT',
              base: 'ETH',
              classification: 'Pair',
              contract: 'Dec19',
              fundingLong: 0,
              fundingShort: 0,
              makerFee: 0,
              margin: 0,
              marginCcy: 'ETH',
              name: 'ETH/USD',
              takerFee: 0,
              underlying: 'USD',
            }],
          },
        },
      );
    });
  });
  describe('CDF functionality tests', () : void => {
    test('getQuasiLiveData: controller test', async () : Promise<void> => {
      const resultData = await getQuasiLiveData({ symbol: 'EOS-XBT' });
      expect(Object.keys(resultData)).toEqual(expect.arrayContaining(['EOS-XBT']));
      expect(resultData).toMatchObject({
        'EOS-XBT': {
          Deribit: [{
            serviceName: 'Deribit',
            symbol: 'EOS-XBT',
            base: 'ETH',
            classification: 'Pair',
            contract: 'Dec19',
            fundingLong: 0,
            fundingShort: 0,
            makerFee: 0,
            margin: 0,
            marginCcy: 'ETH',
            name: 'ETH/USD',
            takerFee: 0,
            underlying: 'USD',
          }],
        },
      });
    });
    test('getRatesObjectsWithPlatformName test', async () : Promise<void> => {
      const getFakeName = name.findName;
      const getFakeFloatingNumber = address.longitude;
      const serviceName : string = getFakeName();
      const symbol : string = getFakeName();
      const dummyObject : Array<IQausiLiveProperties> = [{
        serviceName,
        symbol,
        base: getFakeName(),
        fundingLong: getFakeFloatingNumber(),
        fundingShort: getFakeFloatingNumber(),
        makerFee: getFakeFloatingNumber(),
        margin: getFakeFloatingNumber(),
        marginCcy: getFakeName(),
        takerFee: getFakeFloatingNumber(),
        underlying: getFakeName(),
        classification: getFakeName(),
        contract: getFakeName(),
        name: getFakeName(),
        expiry: format(addDays(new Date(), 10), 'M/dd/yyyy'),
        bid: getFakeFloatingNumber(),
        offer: getFakeFloatingNumber(),
      }];
      const [assertionObject] = dummyObject;
      expect(await preprocessQuasiPrices(dummyObject)).toEqual(expect.objectContaining({
        [symbol]: {
          [serviceName]: [{
            ...assertionObject,
          }],
        },
      }));
    });
  });
});
