import express from 'express';
import cors from 'cors';
import environment from '../environment';
import bodyParser from 'body-parser';
import { log as Log } from './utils/logger';
import loansRouter from './routes/loans';
import tokensRouter from './routes/tokens';
import { connect } from 'price-aggregation-db';

const {
  app: appEnv,
} = environment;

const run = async () => {
  await connect();
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/loans', loansRouter);
  app.use('/tokens', tokensRouter);

  app.listen(appEnv.PORT, () => {
    Log.info(`Listening on ${appEnv.PORT}`);
  });
};

export default run;
