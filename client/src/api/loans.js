import { basicGet } from '@nomisma/utils';
import {
  getLoanTokens,
} from './urls';

export const fetchLoanTokens = basicGet(
  getLoanTokens()
);
