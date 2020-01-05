import { ReactNode } from 'react';

export interface ICfdProps {
  startQuasiLiveFetch () : void;
}
export type ICfdDispatchProps = ICfdProps;

interface ICfdColumn {
  columnName : string;
  enabled : boolean;
  key : string;
  render ? () : void;
  selector ? () : void;
}
export interface ICfdTableMapProps {
  columns : Array<ICfdColumn>;
  tableData : Array<string>;
  uniqueProviderNames : Array<string>;
  cfdHeader : Array<string>;
  cfdKey : Array<string>;
  cfdBody : Array<Array<string>>;
}
export type ICfdTableProps = ICfdTableMapProps;
interface IItem {
  abbrKey : string;
  value : string;
}
interface ICurrencyPairsItem {
  item : IItem;
  key : string;
  onSelectChange () : void;
}

export interface IPreferencesMapProps {
  holdingPeriod : string;
  currencyPairs : string;
  futureContract : string;
  cvaFva : string;
  currencyPairsItems : Array<ICurrencyPairsItem>;
  cvaFvaItems : Array<ICurrencyPairsItem>;
  futureContractItems : Array<ICurrencyPairsItem>;
}
export interface IPreferencesDispatchProps {
  marketUpdateParameters() : void;
}

export type IPreferencesProps = IPreferencesMapProps & IPreferencesDispatchProps;

export interface ICFDModalData {
  title : string;
  render() : ReactNode;
}

export interface ITailoredSettingsMapProps {
  showTailoredSettings : boolean;
  showCFDModal : boolean;
  cfdModalsData : Array<ICFDModalData>;
  initialMarginTableHeader : Array<string>;
  initialMarginTableKey : Array<string>;
  initialMarginTableBody : Array<Array<string>>;
  selectedTabCFDModal : number;
}

export interface ITailoredSettingsDispatchProps {
  toggleTailoredView() : void;
  toggleCFDModal() : void;
  onCFDModalTabChange() : void;
  onCFDModalClose() : void;
}

export type ITailoredSettingsProps = ITailoredSettingsMapProps & ITailoredSettingsDispatchProps;

export interface IFVAMapProps {
  showCFDModal : boolean;
  cfdModalsData : Array<ICFDModalData>;
  initialMarginTableHeader : Array<string>;
  initialMarginTableKey : Array<string>;
  initialMarginTableBody : Array<Array<string>>;
  selectedTabCFDModal : number;
}

export interface IFVADispatchProps {
  toggleCFDModal() : void;
  onCFDModalTabChange() : void;
  onCFDModalClose() : void;
}

export type IFVAProps = IFVAMapProps & IFVADispatchProps;

export type TFVAInitialMarginTableBody = string | number | ReactNode;
