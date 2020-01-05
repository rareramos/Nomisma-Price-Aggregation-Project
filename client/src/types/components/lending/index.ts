export interface ILendingStateProps {
  columns : Array<string>;
  filter : {};
  loading : boolean;
  pageCount : number;
  tableData : Array<{}>;
}

export interface ILendingDispatchProps {
  handlePageChange () : void;
  sortByColumn () : void;
}

export type ILendingProps = ILendingStateProps & ILendingDispatchProps;
