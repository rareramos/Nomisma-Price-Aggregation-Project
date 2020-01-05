/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const dbAdapter = require('price-aggregation-db');

require('../../utils/polyfill');
const { log } = require('../../utils/logger');
const environment = require('../../../environment');

const modulePath = '../../adapters';

const setupStopHandler = (runnerKey) => {
  process.on('message', (message) => {
    if (message === 'STOP') {
      log.info({
        message: `Process ${runnerKey} received STOP message. Quiting`,
      });

      process.exit(0);
    }
  });
};

const setupProcess = async () => {
  process.stdin.resume();
  const runnerKey = process.argv[2];
  setupStopHandler(runnerKey);
  const processPath = path.join(modulePath, runnerKey, 'index.js');
  dbAdapter.setEnvironment(environment);
  dbAdapter.setLogger(log);
  await dbAdapter.connect();
  /* eslint-disable-next-line global-require, import/no-dynamic-require */
  const processRunner = require(processPath).default;
  processRunner();

  log.info({
    message: `Started process ${processPath}`,
  });
};

setupProcess();
