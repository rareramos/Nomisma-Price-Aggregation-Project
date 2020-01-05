import fetchFxcm from '../index';
import { getSinkParams } from '../../../utils/common';
import * as setupPublisher from '../../publisher';
import { ISinkData } from '../../../types/adapters/publisher';

describe('fxcm test', () : void => {
  let mockSetupPublisher;
  afterAll(() : void => {
    mockSetupPublisher.mockClear();
  });
  it('setupPublisher()', async (done : () => void) : Promise<void> => {
    mockSetupPublisher = jest.spyOn(setupPublisher, 'default');
    mockSetupPublisher.mockImplementation(() => Promise.resolve((sinkData : ISinkData) => {
      const recieved = Object.keys(sinkData);
      const expected = getSinkParams();
      expect(recieved).toEqual(expect.arrayContaining(expected));
      expected.forEach((sinkDataKey : string) : void => {
        expect(sinkData[sinkDataKey]).not.toBeFalsy();
      });
      done();
    }));
    await fetchFxcm();
  }, 10000);
});
