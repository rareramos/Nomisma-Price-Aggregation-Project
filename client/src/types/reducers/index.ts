import { ICfdState } from './cfd';
import { IInstrumentState } from './instruments';
import { IChart } from './chart';

export interface IState {
  cfd : ICfdState;
  instruments : IInstrumentState;
  topTab : string;
  chart ? : IChart;
}
