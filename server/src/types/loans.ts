export interface ICollaterals {
  token : string;
  amount : string;
}

export interface ILoansTable {
  repaidPercentage : string;
  loanTimestamp : number;
  loanSymbol : string;
  collateralSymbol : string;
  ccr : string;
  principal : string;
  loanTermSeconds : number;
  apr : string;
  principalTokenName : string;
  platform : string;
  principalUsd : string;
  interestInBase : string;
  principalInBase : string;
  repaidInBase : string;
  collateralInBase : string;
  allCollaterals : Array<ICollaterals>;
  transactionHash : string;
}

export interface ILoansData {
  items : Array<ILoansTable>;
  meta : number;
}

export interface ILoanVolumes {
  timestamp : number;
  loansAmount : number;
  totalValueUsd : number;
}

export interface ILoanTokens {
  tokens : Array<string>;
}

export interface ILoanSelector {
  _id : number;
  count : number;
  amounts : Array<string>;
  length ? : number;
}

export interface IGetLoan {
  offset : number;
  limit : number;
  token : string;
  sort : string;
  order : string;
  platform : string;
}

export interface IPlatformFilters {
  [key : string] : string;
}

export interface ILoanTimeStamp {
  $gt : number;
}

export interface IPlatform {
  platform ? : string;
  updateBlock ? : string;
  loanSymbol ? : string;
  loanTimestamp ? : ILoanTimeStamp;
}
