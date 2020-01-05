// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'supertest';
import { CronJob } from 'cron';

export interface IAppRequest {
  send (url : string, options : IRequestOptions) : Request;
  statusCode ? : number;
  body ? : object;
}

export interface IRequestMethods {
  get : string;
  post : string;
  put : string;
  delete : string;
}

export interface IRequestOptions {
  query ? : object;
  body ? : object;
}

export interface ITableStyle {
  width : string;
  border : string;
  'border-spacing' : string;
  'border-collapse' : string;
}

export interface ISuperTestRequest {
  send : (url : string, options : IRequestOptions) => IAppRequest;
}

export interface ICronJob extends CronJob {
  destroy ? : () => void;
}
