import '@babel/register';
import '@babel/polyfill';

import { setEnvironment, setLogger } from 'price-aggregation-db';
import { log } from '../utils/logger';
import { app } from '../../environment';

import server from '../index';

import '../cron';

setEnvironment(app);
setLogger(log);

server();
