// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Document, Page, Text, View, StyleSheet,
} from '@react-pdf/renderer';
import numeral from 'numeral';

import { IReportParams, ISummary, IQausiLiveProperties } from '../../types';
/*
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from '@david.kucsai/react-pdf-table';
*/
// Create styles
const createSheet = Object.create(StyleSheet);
const styles = createSheet.create({
  page: {
    paddingTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    textAlign: 'center',
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  table: {
    display: 'table',
    width: 'auto',
    margin: '10 0',
    flexDirection: 'column',
    flexShrink: 1,
  },
  tableRow: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: 'grey',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderColor: 'grey',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: '6.66%',
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 500,
    textAlign: 'center',
  },
  tableCol: {
    flexGrow: 1,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
});

// Create Document Component
export const Report = ({ timestamp, summary } : IReportParams) : JSX.Element => (
  <Document>
    <Page orientation="landscape" size="A1" style={styles.page}>
      <Text style={styles.header} fixed>
        Daily Checking Instruments Report
      </Text>
      <Text style={styles.title}>Daily Checking Instruments Report</Text>
      <Text style={styles.subtitle}>{timestamp}</Text>

      <Text style={[styles.title, { marginTop: 10 }]}>Summary</Text>
      <View style={{ paddingLeft: 50 }}>
        {Array.from(summary).map((result : ISummary) : JSX.Element => (
          <View key={result.serviceName}>
            <Text>
              {result.serviceName}:
              {result.status ? (
                <Text style={{ color: 'green' }}>Successful</Text>
              ) : (
                <Text style={{ color: 'red' }}>Unsuccessful</Text>
              )}
              <Text>
                {' '}
                {result.matched} instruments matched; {result.unmatched} instrument unmatched;
              </Text>
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.title, { marginTop: 20 }]}>Details</Text>
      <View>
        {Array.from(summary).map((result : ISummary) : JSX.Element => (
          <View key={result.serviceName}>
            <View style={{ paddingLeft: 50 }}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{`${result.serviceName} Daily Check`}: </Text>
                {result.status ? (
                  <Text style={{ color: 'green' }}>Successful</Text>
                ) : (
                  <Text style={{ color: 'red' }}>Unsuccessful</Text>
                )}ISummary
                <Text>
                  {' '}
                  {result.matched} instruments matched; {result.unmatched} instrument unmatched;
                </Text>
              </Text>
            </View>
            <View>
              <View style={{ paddingLeft: 50 }}>
                <Text>Combined Data Table</Text>
              </View>
              <View style={styles.table} wrap>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCellHeader}>Platform</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol API</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol - Data Scraping</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Pair</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Contract</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol - Nomisma</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Classification</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Live Bid</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Live Ask</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Daily Funding Long</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Daily Funding Short</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Trading Fees (Maker)</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Trading Fees (Taker)</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Margin Ccy</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>M. Margin</Text>
                  </View>
                </View>
                {result.combinedData.map((row : IQausiLiveProperties) : JSX.Element => (
                  <View key={row._id} style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCellHeader}>{row.serviceName}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.serviceSymbol}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.symbolScraping}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.name}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.contract}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.symbol}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.classification}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.bid}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.offer}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {row.fundingLong
                          ? numeral(row.fundingLong / 100).format('0[.][00000000]%')
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {row.fundingShort
                          ? numeral(row.fundingShort / 100).format('0[.][00000000]%')
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.makerFee / 100).format('0[.][00000000]%')}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.takerFee / 100).format('0[.][00000000]%')}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.marginCcy || row.base}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.margin / 100).format('0%')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View>
              <View style={{ paddingLeft: 50 }}>
                <Text>Unmatched Data via API</Text>
              </View>
              <View style={styles.table} wrap>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCellHeader}>Platform</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol API</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol - Data Scraping</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Pair</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Contract</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol - Nomisma</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Classification</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Live Bid</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Live Ask</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Daily Funding Long</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Daily Funding Short</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Trading Fees (Maker)</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Trading Fees (Taker)</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Margin Ccy</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>M. Margin</Text>
                  </View>
                </View>
                {result.unmatchedApiData.map((row : IQausiLiveProperties) : JSX.Element => (
                  <View key={row._id} style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCellHeader}>{row.serviceName}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.serviceSymbol}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.symbolScraping}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.name}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.contract}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.symbol}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.classification}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.bid}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.offer}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {row.fundingLong
                          ? numeral(row.fundingLong / 100).format('0[.][00000000]%')
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {row.fundingShort
                          ? numeral(row.fundingShort / 100).format('0[.][00000000]%')
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.makerFee / 100).format('0[.][00000000]%')}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.takerFee / 100).format('0[.][00000000]%')}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.marginCcy || row.base}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.margin / 100).format('0%')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View>
              <View style={{ paddingLeft: 50 }}>
                <Text>Unmatched Data via Data Scraping</Text>
              </View>
              <View style={styles.table} wrap>
                <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCellHeader}>Platform</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol API</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol - Data Scraping</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Pair</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Contract</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Symbol - Nomisma</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Classification</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Live Bid</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Live Ask</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Daily Funding Long</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Daily Funding Short</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Trading Fees (Maker)</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Trading Fees (Taker)</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>Margin Ccy</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                    <Text style={styles.tableCell}>M. Margin</Text>
                  </View>
                </View>
                {result.unmatchedScrapingData.map((row : IQausiLiveProperties) : JSX.Element => (
                  <View key={row._id} style={styles.tableRow}>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCellHeader}>{row.serviceName}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.serviceSymbol}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.symbolScraping}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.name}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.contract}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.symbol}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.classification}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.bid}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.offer}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {row.fundingLong
                          ? numeral(row.fundingLong / 100).format('0[.][00000000]%')
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {row.fundingShort
                          ? numeral(row.fundingShort / 100).format('0[.][00000000]%')
                          : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.makerFee / 100).format('0[.][00000000]%')}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.takerFee / 100).format('0[.][00000000]%')}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>{row.marginCcy || row.base}</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCell}>
                        {numeral(row.margin / 100).format('0%')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

/*
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Table
        data={[
          {
            firstName: 'John',
            lastName: 'Smith',
            dob: new Date(2000, 1, 1),
            country: 'Australia',
            phoneNumber: 'xxx-0000-0000',
          },
        ]}
      >
        <TableHeader textAlign={'center'}>
          <TableCell weighting={0.3}>First Name</TableCell>
          <TableCell weighting={0.3}>Last Name</TableCell>
          <TableCell>DOB</TableCell>
          <TableCell>Country</TableCell>
          <TableCell>Phone Number</TableCell>
        </TableHeader>
        <TableBody>
          <DataTableCell weighting={0.3} getContent={r => r.firstName} />
          <DataTableCell weighting={0.3} getContent={r => r.lastName} />
          <DataTableCell getContent={r => r.dob.toLocaleString()} />
          <DataTableCell getContent={r => r.country} />
          <DataTableCell getContent={r => r.phoneNumber} />
        </TableBody>
      </Table>
    </Page>
  </Document>
*/
