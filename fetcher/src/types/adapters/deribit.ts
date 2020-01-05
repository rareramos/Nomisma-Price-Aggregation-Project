export interface IDeribitInstruments {
  'tick_size' : number;
  'taker_commission' : number;
  'settlement_period' : string;
  'quote_currency' : string;
  'min_trade_amount' : number;
  'maker_commission' : number;
  'kind' : string;
  'is_active' : boolean;
  'instrument_name' : string;
  'expiration_timestamp' : number;
  'creation_timestamp' : number;
  'contract_size' : number;
  'base_currency' : string;
}
