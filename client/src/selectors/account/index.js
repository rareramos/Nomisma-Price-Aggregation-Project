// root selectors
const selectAccountFromState = (state) => state.account;
const selectAuthFromState = (state) => selectAccountFromState(state).auth;

// data selectors
export const isAuthenticatedSelector = (state) => selectAuthFromState(state).authenticated;
