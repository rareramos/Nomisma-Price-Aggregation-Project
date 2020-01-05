/* eslint-disable react/no-multi-comp */
import React from 'react';
import { InputBox } from '@nomisma/nomisma-ui/form/input-box';

export const cfdColumns = [
  {
    columnName: 'Platform',
    key: 'platform',
    enabled: true,
    selector: item => item.platform,
  },
  {
    columnName: 'Symbol API',
    key: 'serviceSymbol',
    enabled: false,
  },
  {
    columnName: 'Symbol Data Scraping',
    key: 'scrapingSymbol',
    enabled: false,
    selector: item => item.symbol,
  },
  {
    columnName: 'Pair',
    key: 'name',
    enabled: false,
  },
  {
    columnName: 'Expiry',
    key: 'expiry',
    enabled: false,
  },
  {
    columnName: 'Symbol - Nomisma',
    key: 'symbol',
    enabled: false,
  },
  {
    columnName: 'Classification',
    key: 'classification',
    enabled: false,
  },
  {
    columnName: 'Bid',
    key: 'bid',
    enabled: true,
    selector: (item) => {
      const bid = (parseFloat(item.bid)).toFixed(2);
      return `${bid}`;
    },
  },
  {
    columnName: 'Ask',
    key: 'offer',
    enabled: true,
    selector: (item) => {
      const ask = (parseFloat(item.offer)).toFixed(2);
      return `${ask}`;
    },
  },
  {
    columnName: 'Credit Grade',
    key: 'credit-grade',
    enabled: true,
    selector: item => item.creditGrade,
  },
  {
    columnName: 'Implied PD',
    key: 'implied-pd',
    enabled: true,
    selector: item => item.impliedPd,
  },
  {
    columnName: 'Enter PD',
    key: 'pd',
    enabled: false,
    selector: item => (
      <InputBox
        disabled={false}
        name="info_field"
        placeholder=""
        type="text"
        value={item}
        unit="%"
        onChange={() => null}
        invalid={false}
      />
    ),
  },
  {
    columnName: 'CVA',
    key: 'cva',
    enabled: true,
    selector: (item) => {
      const cva = (parseFloat(item.cva)).toFixed(2);
      return `${cva}`;
    },
  },
  {
    columnName: 'FVA',
    key: 'fva',
    enabled: true,
    selector: (item) => {
      const fva = (parseFloat(item.fva)).toFixed(2);
      return `${fva}`;
    },
  },
  {
    columnName: 'Trading Fee',
    key: 'tradingFee',
    enabled: true,
    selector: (item) => {
      const tradingFee = (parseFloat(item.tradingFee)).toFixed(2);
      return `${tradingFee}`;
    },
  },
  {
    columnName: 'Funding Long',
    key: 'fundingLong',
    enabled: true,
    selector: (item) => {
      const value = parseFloat(item.fundingLong).toFixed(4);
      return `${value}%`;
    },
  },
  {
    columnName: 'Funding Short',
    key: 'fundingShort',
    enabled: true,
    selector: (item) => {
      const value = parseFloat(item.fundingShort).toFixed(4);
      return `${value}$`;
    },
  },
  {
    columnName: 'Adjusted Bid',
    key: 'adjustedBid',
    enabled: true,
    selector: (item) => {
      const adjustedBid = (parseFloat(item.adjustedBid)).toFixed(2);
      return `${adjustedBid}`;
    },
  },
  {
    columnName: 'Adjusted Ask',
    key: 'adjustedAsk',
    enabled: true,
    selector: (item) => {
      const adjustedAsk = (parseFloat(item.adjustedAsk)).toFixed(2);
      return `${adjustedAsk}`;
    },
  },
  {
    columnName: 'Estimated Carry (Perpetual Only)',
    key: 'estimatedCarry',
    enabled: false,
    selector: (item) => {
      const estimatedCarry = (parseFloat(item.estimatedCarry)).toFixed(2);
      return `${estimatedCarry}$`;
    },
  },
  {
    columnName: 'Trading Fees (Maker)',
    key: 'makerFee',
    enabled: false,
    selector: (item) => {
      const value = (parseFloat(item.makerFee)).toFixed(3);
      return `${value}%`;
    },
  },
  {
    columnName: 'Trading Fees (Taker)',
    key: 'takerFee',
    enabled: false,
    selector: (item) => {
      const value = (parseFloat(item.takerFee)).toFixed(3);
      return `${value}%`;
    },
  },
  {
    columnName: 'Margin Ccy',
    key: 'marginCcy',
    enabled: false,
    selector: item => item.marginCcy,
  },
  {
    columnName: 'M. Margin',
    key: 'margin',
    enabled: false,
    selector: (item) => {
      const value = (parseFloat(item.margin)).toFixed(2);
      return `${value}%`;
    },
  },
];

export const mockCfdData = [
  {
    platform: 'Bitmex',
    bid: 5194,
    ask: 5194.5,
    fva: 0.02,
    cva: 1.19,
    tradingFee: 3.9,
    adjustedBid: 5188.88,
    adjustedAsk: 5199.62,
    estimatedCarry: 2.01,
  },
  {
    platform: 'OKex',
    bid: 5180.56,
    ask: 5180.72,
    fva: 0.25,
    cva: 2.23,
    tradingFee: 1.55,
    adjustedBid: 5176.52,
    adjustedAsk: 5184.76,
    estimatedCarry: 1.14,
  },
  {
    platform: 'Kraken',
    bid: 5186,
    ask: 5186.5,
    fva: 0.05,
    cva: 0.7,
    tradingFee: 3.89,
    adjustedBid: 5181.36,
    adjustedAsk: 5191.14,
    estimatedCarry: 4.23,
  },
  {
    platform: 'Derbit',
    bid: 5187.25,
    ask: 5187.5,
    fva: 0.02,
    cva: 1.19,
    tradingFee: 2.59,
    adjustedBid: 5183.44,
    adjustedAsk: 5191.31,
    estimatedCarry: 0,
  },
];

export const cvaSettingItems = [
  {
    abbrKey: 'Default',
    value: 'Default',
  },
  {
    abbrKey: 'Tailored',
    value: 'Tailored',
  },
];

export const currencyPairsItems = [
  {
    abbrKey: 'BTC/USD',
    value: 'BTC/USD',
  },
  {
    abbrKey: 'ETH/USD',
    value: 'ETH/USD',
  },
];

export const futuresContractItems = [
  {
    abbrKey: 'Perpetual',
    value: 'Perpetual',
  },
  {
    abbrKey: 'Apr',
    value: 'Apr',
  },
  {
    abbrKey: 'May',
    value: 'May',
  },
  {
    abbrKey: 'Jun',
    value: 'Jun',
  },
  {
    abbrKey: 'Sep',
    value: 'Sep',
  },
];

export const brokersCreditCVAItems = [
  {
    abbrKey: 'Credit Grade',
    value: 'Credit Grade',
  },
  {
    abbrKey: 'Probability Of Default',
    value: 'Probability Of Default',
  },
  {
    abbrKey: 'Credit Spreads (Tailored Setting)',
    value: 'Credit Spreads (Tailored Setting)',
  },
];

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const sortFuturesContractItems = arr => arr.sort(
  (val1, val2) => monthNames.indexOf(val1.item.abbrKey.slice(0, 3))
    - monthNames.indexOf(val2.item.abbrKey.slice(0, 3)),
);

export const cfdInitialMarginColumns = [
  {
    columnName: 'Platform',
    key: 'platform',
    enabled: true,
    selector: item => item,
  },
  {
    columnName: 'Initial Margin',
    key: 'margin',
    enabled: true,
    selector: item => item.margin,
  },
];
