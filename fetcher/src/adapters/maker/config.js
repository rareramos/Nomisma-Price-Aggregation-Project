import path from 'path';
import fs from 'fs';
import { getContract } from '../generic';
import environment from '../../../environment';

const makerSaiTubAbiPath = path.resolve(__dirname, './sai-tub-abi.json');

export const saiTubAbi = fs.readFileSync(makerSaiTubAbiPath, 'utf8');
export const makerOpenEventName = 'LogNewCup';
export const makerDrawEventName = 'draw';
export const makerLockEventName = 'lock';
export const makerWipeEventName = 'wipe';

export const makerOpenModelConfig = {
  /**
   * open() (bytes32 cup)
   * opens cup and returns cup id
   */
  [makerOpenEventName]: 'maker-open',
};

export const makerSigsModelConfig = {
  /**
   * draw (cup bytes32, wad uint256)
   *
   * gets loan
   *
   * withdraws the specified amount of Dai as a loan against the
   * collateral in the CDP. As such, it will fail if the CDP doesn't
   * have enough PETH locked in it to remain at least 150%
   * collateralized.
   */
  [makerDrawEventName]: 'maker-draw',
  /**
   * exit (wad uint256)
   * withdraw converts amount of Peth to Weth, at the Weth to
   * Peth Ratio
   */
  exit: 'maker-exit',

  /**
   * free (cup bytes32, wad uint256)
   * withdraws the specified amount of PETH and returns it to the
   * owner's address. As such, the contract will only allow you to
   * free PETH that's locked in excess of 150% of the CDP's
   * outstanding debt.
   */
  free: 'maker-free',

  [makerLockEventName]: 'maker-lock', // post collateral (cup bytes32, wad uint256)

  /**
   * wipe (cup bytes32, wad uint256)
   * sends Dai back to the CDP in order to repay some (or all) of
   * its outstanding debt.
   */
  [makerWipeEventName]: 'maker-wipe',

  /**
   * shut (cup bytes32)
   * wipes all remaining dai, frees all remaining collateral,
   * and deletes the CDP. This will fail if the caller does not
   * have enough DAI to wipe all the dai debt and enough MKR to
   * pay for all the accrued stability fee
   *
   * This would call `wipe` and then `free`
   */
  shut: 'maker-shut',
};

export const getSaiTubContract = () => getContract({
  abi: saiTubAbi,
  contractAddress: environment.blockchain.MAKER_SAI_TUB_ADDRESS,
});
