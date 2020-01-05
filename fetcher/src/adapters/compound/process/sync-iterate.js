import { getWeb3 } from '../../generic';

const web3 = getWeb3();
const BN = web3.utils.BN;

const borrowEventsToHash = borrowEvents => {
  const borrowMatrix = {};
  borrowEvents.forEach(
    (
      {
        asset,
        account,
        amount,
        transactionHash,
        blockNumber,
        startingBalance,
        newBalance,
        borrowAmountWithFee,
      }
    ) => {
      if (!!borrowMatrix[asset] && !!borrowMatrix[asset][account]) {
        const updatedBalance = borrowMatrix[asset][account].borrowAmount.add(new BN(amount));
        const newLoans = [
          ...borrowMatrix[asset][account].loans,
          {
            transactionHash,
            blockNumber,
            principal: amount,
            repaid: new BN(0),
            startingBalance,
            newBalance,
          },
        ];
        borrowMatrix[asset][account] = {
          borrowAmount: updatedBalance,
          principalWithInterest: borrowMatrix[asset][account].principalWithInterest,
          endBalance: borrowMatrix[asset][account].endBalance,
          loans: newLoans,
        };
      } else if (!!borrowMatrix[asset]) {
        borrowMatrix[asset][account] = {
          borrowAmount: new BN(amount),
          endBalance: new BN(0),
          principalWithInterest: new BN(0),
          loans: [
            {
              transactionHash,
              blockNumber,
              principal: amount,
              borrowAmountWithFee,
              repaid: new BN(0),
              startingBalance,
              newBalance,
            },
          ],
        };
      } else {
        borrowMatrix[asset] = {
          [account]: {
            borrowAmount: new BN(amount),
            principalWithInterest: new BN(0),
            endBalance: new BN(0),
            loans: [
              {
                transactionHash,
                blockNumber,
                principal: amount,
                borrowAmountWithFee,
                repaid: new BN(0),
                startingBalance,
                newBalance,
              },
            ],
          },
        };
      }
    });
  return borrowMatrix;
};

const borrowRepaidEventsToHash = ({
  borrowMatrix,
  borrowRepaidEvents,
}) => {
  borrowRepaidEvents.forEach(({
    account,
    asset,
    startingBalance,
    newBalance,
    transactionHash,
    blockNumber,
    amount,
  }) => {
    if (!!borrowMatrix[asset][account].repays) {
      borrowMatrix[asset][account].repays = [
        ...borrowMatrix[asset][account].repays,
        {
          startingBalance,
          newBalance,
          transactionHash,
          blockNumber,
          amount,
        },
      ];
    } else {
      borrowMatrix[asset][account].repays = [
        {
          startingBalance,
          newBalance,
          transactionHash,
          blockNumber,
          amount,
        },
      ];
    }
    borrowMatrix[asset][account].principalWithInterest = borrowMatrix[asset][account].principalWithInterest
      .add(
        new BN(amount)
      );
  });
  return borrowMatrix;
};

const borrowMatrixToLoansArr = ({
  borrowMatrix,
  blockTimestamps,
}) => Object.entries(borrowMatrix).reduce(
  (
    accountsAcc,
    [
      asset,
      accountsObj,
    ]
  ) => {
    Object.entries(accountsObj).forEach(
      (
        [
          ,
          accountObj,
        ]
      ) => {
        if (
          !!accountObj.repays
          && !!accountObj.repays.length
        ) {
          accountObj.endBalance = new BN(
            accountObj.repays[accountObj.repays.length - 1].newBalance
          );
        }
      });
    const accountsObjArr = Object.entries(accountsObj).reduce(
      (
        loansAcc,
        [
          account,
          {
            loans,
            endBalance,
            principalWithInterest,
            repays,
            borrowAmount,
          },
        ]
      ) => {
        let interest;
        let repaidFixedPercentage;
        let needsBalanceRequest;
        let timestampEnd;
        if (
          endBalance.eq(new BN(0))
          && repays
          && repays.length
          && principalWithInterest.gt(borrowAmount)
        ) {
          // this is normal flow loans have been fully repaid so we are able to
          // determine interest based on borrowed/repaid events
          interest = principalWithInterest
            .sub(borrowAmount);
          repaidFixedPercentage = new BN('100');
          const lastRepayBlockNumber = repays.sort((a, b) => b.blockNumber - a.blockNumber)[0].blockNumber;
          timestampEnd = blockTimestamps[lastRepayBlockNumber].timestamp;
          needsBalanceRequest = false;
        } else if (
          // something is wrong about it. possibly the liquidation happened. hard
        // to determine interest. TODO
          endBalance.eq(new BN(0))
          && repays
          && repays.length
        ) {
          interest = null;
          repaidFixedPercentage = new BN('100');
          needsBalanceRequest = false;
          // this is probably wrong. instead we should check liquidation
          // timestamp
          const lastRepayBlockNumber = repays.sort((a, b) => b.blockNumber - a.blockNumber)[0].blockNumber;
          timestampEnd = blockTimestamps[lastRepayBlockNumber].timestamp;
        } else if (repays && repays.length) {
          // end balance is not 0 the loan is partially repaid.
          // to determine the interest rate and balance we need to make additional
          // call to contract
          repaidFixedPercentage = null;
          interest = null;
          needsBalanceRequest = true;
          timestampEnd = null;
        } else {
          // loan does not have any repays, meaning it is current.
          repaidFixedPercentage = new BN(0);
          interest = null;
          needsBalanceRequest = true;
          timestampEnd = null;
        }
        const mappedLoans = loans.map(
          ({
            transactionHash,
            blockNumber,
            borrowAmountWithFee,
            principal,
          }) => ({
            account,
            asset,
            transactionHash,
            principal,
            blockNumber,
            borrowAmountWithFee,
            repaidFixedPercentage,
            timestampEnd,
            interest,
            needsBalanceRequest,
            principalWithInterest,
            borrowAmount,
          })
        ) // edge case. loan with 0 borrow amount is not a loan.
          .filter(
            loan => loan.borrowAmountWithFee && loan.borrowAmountWithFee !== '0'
          );
        return [ ...loansAcc, ...mappedLoans];
      },
      []
    );
    return [
      ...accountsAcc,
      ...accountsObjArr,
    ];
  },
  []
);

const mapLoansArr = loansArr => loansArr.map(({
  account,
  asset,
  blockNumber,
  borrowAmountWithFee,
  interest,
  repaidFixedPercentage,
  transactionHash,
  needsBalanceRequest,
  principalWithInterest,
  borrowAmount,
  timestampEnd,
  principal,
}) => ({
  account,
  asset,
  blockNumber,
  borrowAmountWithFee,
  transactionHash,
  needsBalanceRequest,
  principalWithInterest,
  principal,
  timestampEnd,
  borrowAmount,
  interest: interest ? interest.toString() : interest,
  repaid: repaidFixedPercentage ? repaidFixedPercentage.toString() : repaidFixedPercentage,
}));

export const syncIterateLoans = ({
  borrowEvents,
  borrowRepaidEvents,
  blockTimestamps,
}) => {
  let borrowMatrix = borrowEventsToHash(borrowEvents);
  borrowMatrix = borrowRepaidEventsToHash({
    borrowMatrix,
    borrowRepaidEvents,
  });

  const loansArr = borrowMatrixToLoansArr({
    borrowMatrix,
    blockTimestamps,
  });

  return mapLoansArr(loansArr);
};
