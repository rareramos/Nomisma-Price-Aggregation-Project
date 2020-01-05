
import { Store } from 'redux';
import { IState } from 'types/reducers';
import { configureStore } from './index';

export const store : Store<IState> = configureStore();
