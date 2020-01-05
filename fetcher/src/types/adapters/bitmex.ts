export interface ILiveTickDataEvent {
  event : {
    table : string;
    action : string;
    keys : Array<string>;
    data : Array<object>;
  };
}

export interface ILiveTickData {
  symbol : string;
  rootSymbol : string;
  state : string;
  typ : string;
  listing : string;
  front : string;
  expiry : string;
  settle : string;
  relistInterval : null;
  inverseLeg : string;
  sellLeg : string;
  buyLeg : string;
  optionStrikePcnt : null;
  optionStrikeRound : null;
  optionStrikePrice : null;
  optionMultiplier : null;
  positionCurrency : string;
  underlying : string;
  quoteCurrency : string;
  underlyingSymbol : string;
  reference : string;
  referenceSymbol : string;
  calcInterval : null;
  publishInterval : null;
  publishTime : null;
  maxOrderQty : number;
  maxPrice : number;
  lotSize : number;
  tickSize : number;
  multiplier : number;
  settlCurrency : string;
  underlyingToPositionMultiplier : null;
  underlyingToSettleMultiplier : number;
  quoteToSettleMultiplier : null;
  isQuanto : false;
  isInverse : true;
  initMargin : number;
  maintMargin : number;
  riskLimit : number;
  riskStep : number;
  limit : null;
  capped : false;
  taxed : true;
  deleverage : true;
  makerFee : number;
  takerFee : number;
  settlementFee : number;
  insuranceFee : number;
  fundingBaseSymbol : string;
  fundingQuoteSymbol : string;
  fundingPremiumSymbol : string;
  fundingTimestamp : null;
  fundingInterval : null;
  fundingRate : null;
  indicativeFundingRate : null;
  rebalanceTimestamp : null;
  rebalanceInterval : null;
  openingTimestamp : string;
  closingTimestamp : string;
  sessionInterval : string;
  prevClosePrice : number;
  limitDownPrice : null;
  limitUpPrice : null;
  bankruptLimitDownPrice : null;
  bankruptLimitUpPrice : null;
  prevTotalVolume : number;
  totalVolume : number;
  volume : number;
  volume24h : number;
  prevTotalTurnover : number;
  totalTurnover : number;
  turnover : number;
  turnover24h : number;
  homeNotional24h : number;
  foreignNotional24h : number;
  prevPrice24h : number;
  vwap : number;
  highPrice : number;
  lowPrice : number;
  lastPrice : number;
  lastPriceProtected : number;
  lastTickDirection : string;
  lastChangePcnt : number;
  bidPrice : number;
  midPrice : number;
  askPrice : number;
  impactBidPrice : number;
  impactMidPrice : number;
  impactAskPrice : number;
  hasLiquidity : true;
  openInterest : number;
  openValue : number;
  fairMethod : string;
  fairBasisRate : number;
  fairBasis : number;
  fairPrice : number;
  markMethod : string;
  markPrice : number;
  indicativeTaxRate : number;
  indicativeSettlePrice : number;
  optionUnderlyingPrice : null;
  settledPrice : null;
  timestamp : string;
  name ? : string;
}

export interface ICfdScrapingData {
  expiry : string;
  epic : Array<string>;
  serviceName : string;
  bid : number;
  offer : number | null;
  fundingLong : number;
  fundingShort : number;
  margin : number | null;
  guaranteedStop : boolean;
  guaranteedStopPremium : number;
}

export interface IProxy {
  (event : string, callback : () => void) : void | null;
}

export interface ISinkData {
  symbol : string;
  serviceName : string;
  base : string;
  underlying : string;
  offer : number;
  bid : number;
}
