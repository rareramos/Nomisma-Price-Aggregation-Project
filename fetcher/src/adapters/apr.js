import { maclaurinBinomialBN } from '@nomisma/nomisma-smart-contract-helpers';
import { bnToFloatStringWithFractionDecimals } from '../utils/bn-float';
import { getWeb3 } from './generic';

const web3 = getWeb3();

const { BN } = web3.utils;

const dayInSeconds = new BN(24 * 60 * 60);

export const RATE_PRECISION_POWER = new BN('6');
export const RATE_PRECISION = new BN('10').pow(RATE_PRECISION_POWER);

export const calculateLoanApr = ({
  timestampStart,
  timestampEnd,
  principal,
  interest,
}) => {
  let toReturn;
  if (new BN(interest).eq(new BN(0))) {
    toReturn = '0';
  } else {
    const loanTermInSeconds = new BN(timestampEnd)
      .sub(
        new BN(timestampStart),
      );
    let interestQ = new BN(principal)
      .div(new BN(interest));

    if (interestQ.eq(new BN(0))) {
      // we can not handle situations when interest is larger than
      // principal itself. In this case we assume that interestQ is
      // 1 which stands for 100% interest rate.
      interestQ = new BN('1');
    }

    const mExpansion = maclaurinBinomialBN({
      k: new BN(
        principal,
      ),
      x: interestQ,
      a: new BN(365).mul(dayInSeconds),
      b: loanTermInSeconds,
      prec: 18,
      BigNumber: BN,
    });

    toReturn = bnToFloatStringWithFractionDecimals(
      mExpansion
        .mul(RATE_PRECISION)
        .mul(new BN(100))
        .sub(new BN(principal))
        .div(new BN(principal)),
      RATE_PRECISION_POWER.toNumber(),
      3,
    );
  }
  return toReturn;
};
