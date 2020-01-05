import React, { Component, Fragment } from 'react';
import {
  bool, arrayOf, string,
  number, func, object, shape, objectOf,
} from 'prop-types';
import { IconSortUp, IconSortDown } from '@nomisma/nomisma-ui/icons';
import { Table } from 'reactstrap';
import Pagination from 'react-js-pagination';

import { Loading } from '../common/loading/index';
import { Styled } from './styled';
import { TableToolbar } from '../table-toolbar';
import { Chart } from '../chart';

export class Lending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
    };
    this.PageChange = this.PageChange.bind(this);
  }

  PageChange(pagenumber) {
    const { handlePageChange } = this.props;

    this.setState({ activePage: pagenumber });
    handlePageChange(pagenumber);
  }

  static renderSortIcon(order) {
    const style = { marginLeft: '0.25rem', fill: 'var(--primary)' };
    if (order === 1) {
      return <IconSortUp style={style} />;
    } if (order === -1) {
      return <IconSortDown style={style} />;
    }
    return null;
  }

  render() {
    const {
      loading,
      tableData,
      pageCount,
      columns,
      sortByColumn,
      filter,
    } = this.props;
    const { activePage } = this.state;
    const itemCounts = (pageCount - 1) * 15;
    return (
      <Styled>
        <Chart />
        <TableToolbar />
        {
          /* eslint-disable-next-line no-nested-ternary */
          loading ? <Loading fill="var(--primary)" /> : tableData.length > 0 ? (
            <Fragment>
              <Table>
                <thead>
                  <tr>
                    { columns.map(({ key, columnName }) => (
                      <th
                        key={columnName}
                        onClick={() => sortByColumn(key)}
                      >
                        { columnName }
                        { filter.sort === key ? Lending.renderSortIcon(filter.order) : null }
                      </th>
                    )) }
                  </tr>
                </thead>
                <tbody>
                  { tableData.map(
                    (
                      item,
                      idx,
                    ) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={idx}>
                        { columns.map(
                          (
                            {
                              key,
                            },
                          ) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <td key={`${key}-${idx}`}>
                              { item[key] }
                            </td>
                          ),
                        )
                        }
                      </tr>
                    ),
                  )
                  }
                </tbody>
              </Table>
              <Pagination
                activePage={activePage}
                itemsCountPerPage={15}
                totalItemsCount={itemCounts}
                pageRangeDisplayed={5}
                onChange={this.PageChange}
              />
            </Fragment>
          ) : <p>No results found...</p>
        }
      </Styled>
    );
  }
}

Lending.defaultProps = {
  tableData: [],
};

Lending.propTypes = {
  loading: bool.isRequired,
  pageCount: number.isRequired,
  tableData: arrayOf(object),
  handlePageChange: func.isRequired,
  columns: arrayOf(shape({
    columnName: string, key: string, render: func, selector: func,
  })).isRequired,
  sortByColumn: func.isRequired,
  filter: objectOf(shape({ sort: string, order: number })).isRequired,
};
