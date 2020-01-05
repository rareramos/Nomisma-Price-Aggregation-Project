export type TStringOrNumber = string | number;

export interface IHash<T>{
  [index : string] : T;
}

export interface ICfdColumn {
  columnName : string;
  key : string;
  enabled : boolean;
  selector ?: Function;
}

export interface IChartFilter {
  title : string;
  type : string;
}

export interface ITabs {
  name : string;
  value : string;
}

export interface ICvaSettingItem {
  abbrKey : string;
  value : string;
}

export interface ICvaSettingItems {
  item : ICvaSettingItem;
  key : string;
  onSelectChange () : void;
}

export type TCfdSettingItemList = Array<ICvaSettingItems>;
