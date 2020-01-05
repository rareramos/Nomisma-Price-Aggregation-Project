import { ITabs } from 'types/utils';

export interface ISwitcherStateProps {
  selectedSource : number;
  tabs : Array<ITabs>;
}

export interface ISwitcherDispatchProps {
  onClick () : void;
}

export type ISwitcherProps = ISwitcherStateProps & ISwitcherDispatchProps;
