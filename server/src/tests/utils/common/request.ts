// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

import { app } from '../../../index';
import {
  IRequestOptions, IAppRequest, ISuperTestRequest, IRequestMethods,
} from '../../../types';

/**
 * @name attachRequestMeta
 * @description common function for requests
 * @param type, options (query, body)
 * @return object
 */

export default function attachRequestMeta(type : keyof IRequestMethods) : ISuperTestRequest {
  const requestAppInstance = request(app)[type];
  return {
    send: (url : string, options : IRequestOptions) : IAppRequest => {
      const instance = requestAppInstance(url);
      if (options) {
        const { query, body } = options;
        if (query) { instance.query(query); }
        if (body) { instance.send(body); }
      }
      return instance;
    },
  };
}
