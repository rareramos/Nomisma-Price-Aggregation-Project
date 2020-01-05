import {
  FETCH_LOAN_TOKENS_SUCCESS,
} from '../types';

export const fetchLoanTokensSuccess = (tokens) => ({
  type: FETCH_LOAN_TOKENS_SUCCESS,
  data: { tokens },
});
