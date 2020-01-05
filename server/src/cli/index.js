require('@babel/register');
require('@babel/polyfill');
const Log = require('../utils/logger').log;
const environment = require('../../environment');
const dbAdapter = require('price-aggregation-db');

dbAdapter.setEnvironment(environment);
dbAdapter.setLogger(Log);

const server = require('../index.js').default;

server();
