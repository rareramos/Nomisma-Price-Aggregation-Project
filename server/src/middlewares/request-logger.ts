import { Request, Response, NextFunction } from 'express';

import { log } from '../utils/logger';

export const requestLogger = (req : Request, _res : Response, next : NextFunction) : void => {
  log.debug({
    message: `${req.method} ${req.url}`,
  });
  return next();
};
