/* eslint-disable @typescript-eslint/no-var-requires */
const dbAdapter = require('price-aggregation-db');

require('../utils/polyfill');
const { log } = require('../utils/logger');
const environment = require('../../environment');
const { timeout } = require('../utils/timeout');

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
  'cfd-pipeline': {
    modulePath: '../pipelines',
    runnerPropName: 'cfd',
  },
  'dharma-clean': {
    modulePath: '../adapters/dharma',
    runnerPropName: 'clean',
  },
  'compound-clean': {
    modulePath: '../adapters/compound',
    runnerPropName: 'clean',
  },
  'maker-clean': {
    modulePath: '../adapters/maker',
    runnerPropName: 'clean',
  },
  'loan-clean': {
    modulePath: '../adapters/merge',
    runnerPropName: 'clean',
  },
  'ig-serve': {
    modulePath: '../adapters/ig',
    runnerPropName: 'default',
  },
  'okex-serve': {
    modulePath: '../adapters/okex',
    runnerPropName: 'default',
  },
  'bitmex-serve': {
    modulePath: '../adapters/bitmex',
    runnerPropName: 'default',
  },
  'fxcm-serve': {
    modulePath: '../adapters/fxcm',
    runnerPropName: 'default',
  },
  'deribit-serve': {
    modulePath: '../adapters/deribit',
    runnerPropName: 'default',
  },
  'kraken-serve': {
    modulePath: '../adapters/kraken',
    runnerPropName: 'default',
  },
  'mapping-symbols': {
    modulePath: '../data',
    runnerPropName: 'mappingSymbols',
  },
  'cfd-settings': {
    modulePath: '../data',
    runnerPropName: 'cfdSettings',
  },
  'expiry-dates-mapping': {
    modulePath: '../data',
    runnerPropName: 'expiryDatesMapping',
  },
  'interest-rates-funding-offer': {
    modulePath: '../data',
    runnerPropName: 'interestRatesFundingOffer',
  },
  'funding-offer-tailored': {
    modulePath: '../data',
    runnerPropName: 'fundingOfferTailored',
  },
  'cross-currency-basis': {
    modulePath: '../data',
    runnerPropName: 'crossCurrencyBasis',
  },
  'default-recovery-upon': {
    modulePath: '../data',
    runnerPropName: 'defaultRecoveryUpon',
  },
  'required-initial-margin': {
    modulePath: '../data',
    runnerPropName: 'requiredInitialMargin',
  },
};

const runScript = async (moduleRequired) => {
  await moduleRequired();

  log.info({
    message: 'success!',
  });
};

const loopScript = async (moduleRequired, moduleName, delay) => {
  log.info({
    message: `Starting ${moduleName} process...`,
  });

  await runScript(moduleRequired);

  log.info({
    message: `Delaying ${moduleName} for ${delay / 1000} seconds.`,
  });

  await timeout(delay);
  process.nextTick(async () => {
    await loopScript(moduleRequired, moduleName, delay);
  });
};

const loopRoutinesFactory = ({ moduleRequired, cmd }) => async () => {
  const delay = environment.app.EVENT_HANDLER_TIMEOUT;
  await loopScript(moduleRequired, cmd, delay);
};

const nonLoopRoutinesFactory = ({ moduleRequired }) => async () => {
  await runScript(moduleRequired);
  process.exit(0);
};

const tryCatchRoutines = async (factory) => {
  try {
    await factory();
  } catch (e) {
    log.error({
      message: `Process thrown with error: ${e}. Restarting in 60 seconds`,
    });

    await new Promise(resolve => setTimeout(resolve, 60000));
    await tryCatchRoutines(factory);
  }
};

const start = async () => {
  try {
    dbAdapter.setEnvironment(environment);
    dbAdapter.setLogger(log);
    await dbAdapter.connect();

    const [, , ...args] = process.argv;
    const cmd = args[0];
    const cliConfigObj = cliConfig[cmd];
    if (!cliConfigObj) {
      log.error({
        message: 'Invalid command',
      });

      process.exit(1);
    }

    const { modulePath } = cliConfigObj;
    /* eslint-disable-next-line global-require, import/no-dynamic-require */
    const moduleRequired = require(modulePath)[cliConfigObj.runnerPropName];
    const shouldLoop = args.indexOf('--loop') > -1 || args.indexOf('-l') > -1;
    const shouldCatch = args.indexOf('--catch') > -1 || args.indexOf('-c') > -1;
    let factory;
    if (shouldLoop) {
      factory = loopRoutinesFactory({
        moduleRequired,
        cmd,
      });
    } else {
      factory = nonLoopRoutinesFactory({
        moduleRequired,
      });
    }

    if (shouldCatch) {
      await tryCatchRoutines(factory);
    } else {
      await factory();
    }
  } catch (e) {
    log.error({
      message: e.stack,
    });

    process.exit(1);
  }
};

start();
