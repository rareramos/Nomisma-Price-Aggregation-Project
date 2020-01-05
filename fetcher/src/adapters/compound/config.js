
export const borrowEventName = 'BorrowTaken';
export const borrowRepaidEventName = 'BorrowRepaid';
export const supplyReceivedEventName = 'SupplyReceived';

export const compoundEventNamesToColumnNamesMap = {
  [supplyReceivedEventName]: 'compound-supply-received',
  'SupplyWithdrawn': 'compound-supply-withdrawn',
  [borrowEventName]: 'compound-borrow-taken',
  [borrowRepaidEventName]: 'compound-borrow-repaid',
  'BorrowLiquidated': 'compound-borrow-liquidated',
};
