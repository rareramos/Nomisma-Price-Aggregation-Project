import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { requestLogger } from './request-logger';

export const setupMiddlewares = (app : Application) : void => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(requestLogger);
};
