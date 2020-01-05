import * as httpStatus from 'http-status';

import attachRequestMeta from '../../utils/common/request';
import { ISuperTestRequest } from '../../../types';

describe('Tokens', () : void => {
  test('API tests', async () : Promise<void> => {
    const request : ISuperTestRequest = attachRequestMeta('get');
    const { statusCode } = await request.send('/tokens/tokens', {});
    expect(statusCode).toEqual(httpStatus.OK);
  });
});
