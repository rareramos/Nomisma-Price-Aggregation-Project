import React from 'react';

export const instrumentColumns = [
  {
    title: 'Platform',
    dataIndex: 'serviceName',
    render: serviceName => <strong>{ serviceName }</strong>,
  },
  {
    title: 'Symbol API',
    dataIndex: 'serviceSymbol',
  },
  {
    title: 'Symbol - Data Scraping',
    dataIndex: 'scrapingSymbol',
  },
  {
    title: 'Pair',
    dataIndex: 'name',
  },
  {
    title: 'Expiry',
    dataIndex: 'expiry',
  },
  {
    title: 'Symbol - Nomisma',
    dataIndex: 'symbol',
  },
  {
    title: 'Classification',
    dataIndex: 'classification',
  },
  {
    title: 'Live Bid',
    dataIndex: 'bid',
  },
  {
    title: 'Live Ask',
    dataIndex: 'offer',
  },
  {
    title: 'Daily Funding Long',
    dataIndex: 'fundingLong',
  },
  {
    title: 'Daily Funding Short',
    dataIndex: 'fundingShort',
  },
  {
    title: 'Trading Fees (Maker)',
    dataIndex: 'makerFee',
  },
  {
    title: 'Trading Fees (Taker)',
    dataIndex: 'takerFee',
  },
  {
    title: 'Margin Ccy',
    dataIndex: 'marginCcy',
  },
  {
    title: 'M. Margin',
    dataIndex: 'margin',
  },
];
