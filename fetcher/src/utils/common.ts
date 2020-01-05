/* eslint-disable-next-line import/no-extraneous-dependencies */
import * as faker from 'faker';
import * as dbAdapter from 'price-aggregation-db';

import environment from '../../environment';
import { log } from './logger';

export const getRandomString = () : string => faker.name.findName();
export const getRandomNumber = () : number => faker.address.longitude();

export const getSinkParams = () : Array<string> => ['serviceName', 'base', 'underlying', 'offer', 'bid'];

export const setDbEnvironment = () : void => {
  dbAdapter.setEnvironment(environment);
  dbAdapter.setLogger(log);
};
