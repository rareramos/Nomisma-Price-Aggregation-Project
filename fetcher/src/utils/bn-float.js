
import { getWeb3 } from '../adapters/generic';
/**
 * Modified from `fromWei` of https://github.com/ethjs/ethjs-unit
 * Different from baseStringBNtoFloat, precision is not lost.
 */

const web3 = getWeb3();

const BigNumber = web3.utils.BN;

export const bnToFloatString = (
  input,
  baseLength,
) => {
  const inputBN = new BigNumber(input);
  const baseBN = new BigNumber(10)
    .pow(
      new BigNumber(baseLength),
    );

  let fraction = inputBN.mod(baseBN).toString();
  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }
  const fractionMatch = fraction.match(/^([0-9]*[1-9]|0)(0*)/);
  if (!fractionMatch) {
    throw new Error('Fraction match error. Possible negative value provided.');
  }
  fraction = fractionMatch[1];
  const whole = inputBN.div(baseBN).toString(10);

  return `${whole}${fraction === '0' ? '' : `.${fraction}`}`;
};

export const bnToFloatStringWithFractionDecimals = (
  input,
  baseLength,
  precision,
) => {
  const converted = bnToFloatString(input, baseLength);
  const splitted = converted.split('.');
  let toReturn;
  if (splitted.length < 2) {
    toReturn = `${converted}.${'0'.repeat(precision)}`;
  } else {
    toReturn = `${splitted[0]}.${splitted[1].slice(0, precision)}`;
  }
  return toReturn;
};
