import { IChart } from '../../reducers/chart';
import { IChartFilter } from '../../utils';

export interface IChartCompareStateProps { isInComapreMode : boolean }
export interface IChartCompareDispatchProps { onClick () : void }

export interface IChartCurrenciesStateProps {
  currencies : Array<IChartFilter>;
  selectedSource : string;
}

export interface IChartCurrenciesDispatchProps { onClick () : void }


export interface IChartSourceStateProps {
  sources : Array<IChartFilter>;
  selectedSource : string;
}

export interface IChartSourceDispatchProps { onClick () : void }

export interface IChartPeriodStateProps {
  periods : Array<IChartFilter>;
  selectedSource : string;
}

export interface IChartPeriodDispatchProps { onClick () : void }

export interface IChartViewStateProps extends IChart {
  chartData : [];
  chartDataSecondary : [];
  protocol : string;
}

export interface IChartViewDispatchProps {
  fetchChartData () : void;
}

export type IChartCompareProps = IChartCompareStateProps & IChartCompareDispatchProps;
export type IChartCurrenciesProps = IChartCurrenciesStateProps & IChartCurrenciesDispatchProps;
export type IChartSourceProps = IChartSourceStateProps & IChartSourceDispatchProps;
export type IChartPeriodProps = IChartPeriodStateProps & IChartPeriodDispatchProps;
export type IChartViewProps = IChartViewStateProps & IChartViewDispatchProps;
