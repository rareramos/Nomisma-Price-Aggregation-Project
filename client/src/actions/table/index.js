import {
  TABLE_FETCH,
  TABLE_SAVE,
  TABLE_LOADING_TOGGLE,
  TABLE_SOURCE_UPDATE,
  TABLE_SOURCE_SAVE, TABLE_ERROR,
  TABLE_PAGE_UPDATE,
  TABLE_PAGE_SAVE,
  TABLE_TOKEN_UPDATE,
  TABLE_SORT_BY,
  TABLE_UPDATE_FILTER,
} from '../types';

export const fetchTableData = (protocol, page, token) => ({
  type: TABLE_FETCH,
  data: { protocol, page, token },
});

export const fetchTableSuccess = data => ({
  type: TABLE_SAVE,
  data,
});

export const fetchTableError = data => ({
  type: TABLE_ERROR,
  data,
});

export const toggleTableLoading = () => ({
  type: TABLE_LOADING_TOGGLE,
});

export const updateTableSource = data => ({
  type: TABLE_SOURCE_UPDATE,
  data,
});

export const saveTableSource = data => ({
  type: TABLE_SOURCE_SAVE,
  data,
});

export const updateTablePage = data => ({
  type: TABLE_PAGE_UPDATE,
  data,
});

export const saveTablePage = data => ({
  type: TABLE_PAGE_SAVE,
  data,
});

export const updateTableToken = data => ({
  type: TABLE_TOKEN_UPDATE,
  data,
});

export const sortTableBy = data => ({
  type: TABLE_SORT_BY,
  data,
});

export const updateTableFilter = data => ({
  type: TABLE_UPDATE_FILTER,
  data,
});
