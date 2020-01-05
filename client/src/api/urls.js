import querystring from 'querystring';
export const ROOT_URL = process.env.API_URI || 'http://localhost:8000';

export const getLoanscanFetchApiUrl = ({
  protocol,
  currentPage,
  perPage = 15,
}) => {
  const offset = currentPage * perPage;
  const queryParams = {
    offset,
    protocol,
    limit: 15,
  };
  const queryParamsString = querystring.stringify(queryParams);
  return `${LOANS_API_ENDPOINT}?${queryParamsString}`;
};

export const getOwnTableApiUrl = ({
  protocol,
  token,
  currentPage,
  perPage = 15,
  sort,
  order,
}) => {
  const offset = currentPage * perPage;
  const queryParams = {
    offset,
    protocol,
    limit: 15,
  };
  if (token) {
    queryParams.token = token;
  }
  if (sort !== null && order !== null) {
    queryParams.sort = sort;
    queryParams.order = order;
  }
  const queryParamsString = querystring.stringify(queryParams);
  return `${API_URI}/loans/all?${queryParamsString}`;
};

export const getChartApiUrl = ({
  protocol,
  chartLengthSeconds,
}) => {
  const queryParams = {
    'chart-length-seconds': chartLengthSeconds,
    protocol,
  };
  const queryParamsString = querystring.stringify(queryParams);
  return `${API_URI}/loans/volumes?${queryParamsString}`;
};

export const getLoanTokens = () => `${API_URI}/loans/tokens`;

export const signinAPIURL = () => {
  return 'https://localhost:8000/signin';
};

export const signupAPIURL = () => {
  return 'https://localhost:8000/signup';
};
