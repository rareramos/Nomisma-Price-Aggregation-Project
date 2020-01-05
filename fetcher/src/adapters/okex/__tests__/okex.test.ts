import fetchOkex from '../index';
import * as setupPublisher from '../../publisher';
import { ISinkData } from '../../../types/adapters/publisher';

describe('OKex test', () : void => {
  it('setupPublisher()', async (done : () => void) : Promise<void> => {
    const mock = jest.spyOn(setupPublisher, 'default');
    mock.mockImplementation(() => Promise.resolve((sinkData : ISinkData) : void => {
      const recieved = Object.keys(sinkData);
      const expected = ['serviceName', 'base', 'underlying', 'offer', 'bid'];
      expect(recieved).toEqual(expect.arrayContaining(expected));
      expected.forEach((sinkDataKey : string) : void => {
        expect(sinkData[sinkDataKey]).not.toBeFalsy();
      });
      mock.mockClear();
      done();
    }));
    await fetchOkex();
  });
});
