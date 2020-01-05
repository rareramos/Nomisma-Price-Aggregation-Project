const selectLoans = state => state.loans;

export const selectLoanTokens = state => selectLoans(state).tokens;
