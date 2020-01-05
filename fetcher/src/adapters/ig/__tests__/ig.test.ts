import { IgIndex } from '../ig';
import { igLoginData, igSubscriptionDummyDataArray } from './data-objects';
import { IGlogin } from '../../../types/adapters/ig';

describe('ig index test', () : void => {
  let ig;
  beforeAll(() : void => {
    ig = new IgIndex();
  });

  it('login()', async (done : () => void) : Promise<void> => {
    const loginData : IGlogin = await ig.login();
    const loginDataKeys : Array<string> = Object.keys(loginData);
    expect(Object.keys(igLoginData)).toEqual(loginDataKeys);
    loginDataKeys.forEach((key : string) : void => {
      expect(loginData[key]).not.toBeFalsy();
    });
    done();
  });

  it('setupSubscription()', (done : () => void) : void => {
    const igSubscriptionLiveData = ig.setupSubscription();
    expect(Object.keys(igSubscriptionLiveData)).toEqual(igSubscriptionDummyDataArray);
    done();
  });

  it('setupLightstreamer()', async (done : () => void) : Promise<void> => {
    const loginData = await ig.login();
    const data = await ig.setupLightstreamer(loginData);
    expect(data).toHaveProperty('subscribe');
    expect(data.subscribe).not.toBeFalsy();
    expect(toString.call(data.subscribe)).toEqual('[object Function]');
    done();
  });
});
