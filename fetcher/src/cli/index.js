require('@babel/register');
require('@babel/polyfill');
const Log = require('../utils/logger').log;
const environment = require('../../environment');
const dbAdapter = require('price-aggregation-db');
const timeout = require('../utils/timeout').timeout;

const cliConfig = {
  'compound-fetch': {
    modulePath: '../adapters/compound',
    runnerPropName: 'fetch',
  },
  'compound-process': {
    modulePath: '../adapters/compound',
    runnerPropName: 'process',
  },
  'dharma-fetch': {
    modulePath: '../adapters/dharma',
    runnerPropName: 'fetch',
  },
  'dharma-process': {
    modulePath: '../adapters/dharma',
    runnerPropName: 'process',
  },
  'maker-fetch': {
    modulePath: '../adapters/maker',
    runnerPropName: 'fetch',
  },
  'maker-process': {
    modulePath: '../adapters/maker',
    runnerPropName: 'process',
  },
  'timestamp-fetch': {
    modulePath: '../adapters/timestamp',
    runnerPropName: 'default',
  },
  'simple-pipeline': {
    modulePath: '../pipelines',
    runnerPropName: 'simple',
  },
  'dharma-clean': {
    modulePath: '../adapters/dharma',
    runnerPropName: 'clean',
  },
  'compound-clean': {
    modulePath: '../adapters/compound',
    runnerPropName: 'clean',
  },
};

const runScript = async (moduleRequired) => {
  await moduleRequired();
  Log.info('success!');
};

const loopScript = async (moduleRequired, moduleName, delay) => {
  Log.info(`Starting ${moduleName} process...`);
  await runScript(moduleRequired);

  Log.info(`Delaying ${moduleName} for ${delay / 1000} seconds.`);
  await timeout(delay);
  process.nextTick(async () => {
    await loopScript(moduleRequired, moduleName, delay);
  });
};

const start = async () => {
  try {
    dbAdapter.setEnvironment(environment);
    dbAdapter.setLogger(Log);
    const[,, ...args] = process.argv;
    const cmd = args[0];
    const cliConfigObj = cliConfig[cmd];
    if (!cliConfigObj) {
      Log.error('Invalid command');
      process.exit(1);
    }

    const modulePath = cliConfigObj.modulePath;
    const moduleRequired = require(modulePath)[cliConfigObj.runnerPropName];
    const shouldLoop = args.indexOf('--loop') > -1 || args.indexOf('-l') > -1;
    if(shouldLoop) {
      const delay = environment.app.EVENT_HANDLER_TIMEOUT;
      await loopScript(moduleRequired, cmd, delay);
    } else {
      await runScript(moduleRequired);
      process.exit(0);
    }
  } catch (e) {
    Log.error(`${e.stack}`);
    process.exit(1);
  }
};

start();
