import React from 'react';
import numeral from 'numeral';

export const selectSummaryFromState = state => state.cfd;

export const selectSummaryQuasiLiveData = state => selectSummaryFromState(state).quasiLive;

export const selectSummaryColumns = () => [
  {
    title: 'Platform',
    dataIndex: 'serviceName',
    render: serviceName => <strong>{serviceName}</strong>,
  },
  {
    title: 'Pair',
    dataIndex: 'name',
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
  },
  {
    title: 'Classification',
    dataIndex: 'classification',
  },
  {
    title: 'Expiry Date',
    dataIndex: 'expiry',
  },
  {
    title: 'Duration (years)',
    dataIndex: 'duration',
    render: duration => numeral(duration).format('0[.][0000]'),
  },
  {
    title: 'Daily Funding Long',
    dataIndex: 'fundingLong',
    render: (value, row) => (row.contract !== 'Perpetual' ? 'N/A' : numeral(value / 100).format('%0[.][00000000]')),
  },
  {
    title: 'Daily Funding Short',
    dataIndex: 'fundingShort',
    render: (value, row) => (row.contract !== 'Perpetual' ? 'N/A' : numeral(value / 100).format('%0[.][00000000]')),
  },
  {
    title: 'Margin Ccy',
    dataIndex: 'marginCcy',
  },
  {
    title: 'Trading Fees (Maker)',
    dataIndex: 'makerFee',
    render: makerFee => numeral(makerFee / 100).format('%0[.][00000000]'),
  },
  {
    title: 'Trading Fees (Taker)',
    dataIndex: 'takerFee',
    render: takerFee => numeral(takerFee / 100).format('%0[.][00000000]'),
  },
  {
    title: 'M. Margin',
    dataIndex: 'margin',
    render: margin => numeral(margin / 100).format('%0'),
  },
  {
    title: "G'teed Stop?",
    dataIndex: 'guaranteedStop',
    render: guaranteedStop => (guaranteedStop ? 'Yes' : 'No'),
  },
  {
    title: "G'teed stop premium",
    dataIndex: 'guaranteedStopPremium',
    render: value => (value ? numeral(value).format('$0.00') : 'N/A'),
  },
  {
    title: 'Interest on Cash',
    dataIndex: 'interestCash',
    render: () => '0%',
  },
  {
    title: 'Funding Offer (Default)',
    dataIndex: 'fundingOffer',
    render: fundingOffer => numeral(fundingOffer / 100).format('%0[.][0]'),
  },
  {
    title: 'Cross Currency Basis (Default)',
    dataIndex: 'crossCurrencyBasis',
    render: crossCurrencyBasis => numeral(crossCurrencyBasis / 100).format('%0.00'),
  },
  {
    title: 'Exposure (Default)',
    dataIndex: 'exposure',
    render: exposure => numeral(exposure / 100).format('%0'),
  },
  {
    title: 'Recovery (Default)',
    dataIndex: 'recovery',
    render: recovery => numeral(recovery / 100).format('%0'),
  },
  {
    title: 'Margin (Tailored)',
    dataIndex: 'requiredMargin',
    render: requiredMargin => numeral(requiredMargin / 100).format('%0'),
  },
  {
    title: 'Funding Offer (Tailored)',
    dataIndex: 'fundingOfferTailored',
    render: fundingOfferTailored => numeral(fundingOfferTailored / 100).format('%0'),
  },
  {
    title: 'Interest On Margin (Tailored)',
    dataIndex: 'interestMargin',
    render: interestMargin => numeral(interestMargin / 100).format('%0'),
  },
];
