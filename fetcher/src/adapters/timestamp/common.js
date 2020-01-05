import { log } from '../../utils/logger';
import { getWeb3 } from '../generic';

export const getToBlock = async () => {
  log.info('Getting last block details');
  const web3 = getWeb3();
  const lastBlock = await web3.eth.getBlock('latest');
  const blockNumber = lastBlock.number;
  log.info(`Last block is ${blockNumber}`);
  return blockNumber;
};
