import { basicGet } from '@nomisma/utils';
import {
  getLoanscanFetchApiUrl,
  getOwnTableApiUrl,
} from './urls';

export const fetchLoanscanTable = ({
  protocol,
  currentPage,
  perPage,
}) => basicGet(getLoanscanFetchApiUrl({
  protocol,
  currentPage,
  perPage,
}))();

export const fetchOwnTable = ({
  protocol,
  token,
  currentPage,
  perPage,
  sort,
  order,
}) => basicGet(getOwnTableApiUrl({
  protocol,
  token,
  currentPage,
  perPage,
  sort,
  order,
}))();
