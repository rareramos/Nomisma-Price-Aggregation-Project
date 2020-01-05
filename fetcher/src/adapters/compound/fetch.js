import fs from 'fs';
import path from 'path';
import {
  getCurrentRunnerModelConfig,
  setCurrentRunnerModelsConfig,
} from 'price-aggregation-db';
import { getContract } from '../generic';
import environment from '../../../environment';
import { compoundEventNamesToColumnNamesMap } from './config';
import { getEventOfTypeFactory } from '../common-api';

const abiPath = path.resolve(__dirname, './market-abi.json');

const abi = fs.readFileSync(abiPath, 'utf8');

const runCompound = async () => {
  const contract = getContract({
    abi,
    contractAddress: environment.blockchain.COMPOUND_ADDRESS,
  });
  setCurrentRunnerModelsConfig(compoundEventNamesToColumnNamesMap);
  const modelConfig = getCurrentRunnerModelConfig();
  await Object.entries(modelConfig)
    .reduce(
      getEventOfTypeFactory({
        contract,
      }),
      Promise.resolve(),
    );
};

export default runCompound;
