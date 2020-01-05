import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@nomisma/nomisma-ui/beta/loading';
import { IconSortUp, IconSortDown } from '@nomisma/nomisma-ui/icons';
import { Table } from 'reactstrap';
import Pagination from 'react-js-pagination';

import { Styled } from './styled';
import { TableToolbar } from '../table-toolbar';
import { Chart } from '../chart';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
    };
    this.PageChange = this.PageChange.bind(this);
  }
  PageChange(pagenumber) {
    this.setState({ activePage: pagenumber });
    this.props.handlePageChange(pagenumber);
  }

  renderSortIcon(order) {
    const style = { marginLeft: '0.25rem', fill: 'var(--primary)' };
    if (order === 1) {
      return <IconSortUp style={ style }/>;
    } else if (order === -1) {
      return <IconSortDown style={ style }/>;
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
    const itemCounts = (pageCount - 1) * 15;
    return (
      <Styled>
        <Chart/>
        <TableToolbar/>
        {
          /* eslint-disable-next-line no-nested-ternary */
          loading ? <Loading fill='var(--primary)' /> : tableData.length > 0 ? (
            <Fragment>
              <Table>
                <thead>
                  <tr>
                    { columns.map(({ key, columnName }) => (
                      <th
                        key={ columnName }
                        onClick={ sortByColumn.bind(null, key) }
                      >
                        { columnName }
                        { filter.sort === key ? this.renderSortIcon(filter.order) : null }
                      </th>
                    )) }
                  </tr>
                </thead>
                <tbody>
                  { tableData.map(
                    (
                      item,
                      idx,
                    ) =>
                      (
                        <tr key={ idx }>
                          { columns.map(
                            (
                              {
                                key,
                              }
                            ) => (
                              <td
                                key={ `${key}-${idx}` }
                              > { item[key] } </td>
                            )
                          )
                          }
                        </tr>
                      )
                  )
                  }
                </tbody>
              </Table>
              <Pagination
                activePage={ this.state.activePage }
                itemsCountPerPage={ 15 }
                totalItemsCount={ itemCounts }
                pageRangeDisplayed={ 5 }
                onChange={ this.PageChange }
              />
            </Fragment>
          ) : <p>No results found...</p>
        }
      </Styled>
    );
  }
}

Home.propTypes = {
  loading: PropTypes.bool.isRequired,
  pageCount: PropTypes.number.isRequired,
  tableData: PropTypes.arrayOf(PropTypes.object),
  handlePageChange: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  sortByColumn: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
};
