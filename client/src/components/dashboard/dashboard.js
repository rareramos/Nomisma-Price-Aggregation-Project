/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import {
  shape, objectOf, string, object, func,
} from 'prop-types';
import { SimpleTable } from '@nomisma/nomisma-ui/table/simple-table';
import { Styled } from './styled';

export class Dashboard extends Component {
  componentDidMount() {
    const { fetchInstruments } = this.props;
    fetchInstruments();
  }

  render() {
    const { columns, services } = this.props;

    return (
      <Styled>
        <h5>Summary</h5>
        { Object.keys(services).map((serviceName) => {
          const summary = services[serviceName];
          return (
            <div key={serviceName}>
              <b>{ `${serviceName} Daily Check` }</b>
              :
              { summary.status ? (
                <b style={{ color: 'green' }}> Successful</b>
              ) : (
                <b style={{ color: 'red' }}> Unsuccessful</b>
              ) }
              ;
              <span>
                { `${summary.matched} instruments matched;` }
              </span>
              <span>
                { `${summary.unmatched} instruments unmatched;` }
              </span>
            </div>
          );
        }) }
        <br />
        <h5>Details</h5>
        { Object.keys(services).map((serviceName) => {
          const service = services[serviceName];
          return (
            <div
              key={serviceName}
              style={{ marginTop: 25 }}
            >
              <h5>
                <b>{ `${serviceName} Daily Check` }</b>
                :
                { service.status ? (
                  <b style={{ color: 'green' }}> Successful</b>
                ) : (
                  <b style={{ color: 'red' }}> Unsuccessful</b>
                ) }
                ;
                <span>
                  { `${service.matched} instruments matched;` }
                </span>
                <span>
                  { `${service.unmatched} instruments unmatched;` }
                </span>
              </h5>
              <h6>Combined Data Table</h6>
              <SimpleTable
                data={service.combinedData}
                columns={columns}
              />
              <h6 style={{ margin: '15px 0 0 0' }}>Unmatched Data via API</h6>
              <SimpleTable
                data={service.unmatchedApiData}
                columns={columns}
              />

              <h6 style={{ margin: '15px 0 0 0' }}>Unmatched Data via Data Scraping</h6>
              <SimpleTable
                data={service.unmatchedScrapingData}
                columns={columns}
              />
            </div>
          );
        }) }
      </Styled>
    );
  }
}

Dashboard.propTypes = {
  fetchInstruments: func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  services: object.isRequired,
  columns: objectOf(shape({ title: string, dataIndex: string })).isRequired,
};
