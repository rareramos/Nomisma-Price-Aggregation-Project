import express from 'express';
import { connect, setEnvironment, setLogger } from 'price-aggregation-db';

import * as environment from '../environment';
import { log } from './utils/logger';
import loansRouter from './routes/loans';
import tokensRouter from './routes/tokens';
import cfdRouter from './routes/cfd';
import instrumentsRouter from './routes/instruments';
import { setupMiddlewares } from './middlewares/index';

const { app: appEnv } = environment;
// Set server environments
setEnvironment(appEnv);
setLogger(log);

// Main Application
const app = express();
setupMiddlewares(app);

// api routers
app.use('/loans', loansRouter);
app.use('/tokens', tokensRouter);
app.use('/cfd', cfdRouter);
app.use('/instruments', instrumentsRouter);

const run = async () : Promise<void> => {
  await connect();
  const { app: { PORT } } = appEnv;
  app.listen(PORT, () => {
    log.info({
      message: `Listening on ${PORT}`,
    });
  });
};

export { app };
export default run;
