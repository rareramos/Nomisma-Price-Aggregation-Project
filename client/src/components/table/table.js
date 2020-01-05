import React, { Component } from 'react';
import { object } from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export class CustomPaginationTable extends Component {
  renderShowsTotal(start, to, total) {
    return (
      <p style={{ color: 'blue' }}>
        From { start } to { to }, totals is { total }&nbsp;&nbsp;(its a customize text)
      </p>
    );
  }

  render() {
    const rates = this.props.tableData ? this.props.tableData.rates.dataSlice : '';

    const options = {
      page: 3,  // which page you want to show as default
      sizePerPageList: [ {
        text: '5', value: 5,
      }, {
        text: '10', value: 10,
      }, {
        text: 'All', value: rates.length,
      } ], // you can change the dropdown list for size per page
      sizePerPage: 5,  // which size per page you want to locate as default
      pageStartIndex: 0, // where to start counting the pages
      paginationSize: 3,  // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
      paginationPosition: 'top',  // default is bottom, top and both is all available
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
    };
    return (
      <BootstrapTable
        data={ rates }
        pagination
        options={ options }
      >
        <TableHeaderColumn
          dataField='creationTime'
          isKey
        >Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='id'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='loanTerm'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

CustomPaginationTable.propTypes = {
  tableData: object,
};
