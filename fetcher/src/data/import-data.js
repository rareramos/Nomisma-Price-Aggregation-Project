/* eslint-disable guard-for-in */
import {
  CfdSettings,
  CfdMappingSymbolsData,
  CfdExpiryDatesMappingData,
  CfdRequiredInitialMarginData,
  CfdInterestRatesFundingOfferData,
  CfdCrossCurrencyBasisData,
  CfdFundingOfferTailoredData,
  CfdDefaultRecoveryUponData,
} from 'price-aggregation-db';
import dateFormat from 'date-fns/format';
import dateParse from 'date-fns/parse';
import csv from 'fast-csv';
import path from 'path';
import * as PercentUtils from '../utils/percent';
import { log } from '../utils/logger';

const parseCsv = (filepath, transform = data => data) => new Promise((resolve) => {
  const data = [];
  csv
    .parseFile(path.resolve(__dirname, filepath), { headers: true })
    .on('error', error => log.error({ message: error }))
    .on('data', row => data.push(row))
    .on('end', () => resolve(transform(data)));
});

export const mappingSymbols = async () => {
  const updateDeribitSymbolPromises = [];
  const updateBitmexSymbolPromises = [];
  const updateIgSymbolPromises = [];
  const updateKrakenSymbolPromises = [];

  // Deribit symbols map
  const symbolsMapDeribit = await parseCsv('../adapters/deribit/symbolsMap.csv', data => data.reduce(
    (prev, o) => ({
      ...prev,
      [String(o['Deribit API symbol']).toUpperCase()]: {
        symbol: o['Symbol - Nomisma'],
        name: o.Name,
        contract: o.Contract,
        classification: o.Classification,
      },
    }),
    {},
  ));

  Object.keys(symbolsMapDeribit).forEach((serviceSymbol) => {
    updateDeribitSymbolPromises.push(CfdMappingSymbolsData.updateOne(
      { serviceSymbol, serviceName: 'Deribit' },
      {
        $set: symbolsMapDeribit[serviceSymbol],
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateDeribitSymbolPromises);
  log.info({
    message: `Deribit number of mapping symbols ${Object.keys(symbolsMapDeribit).length}`,
  });

  // Bitmex symbols map
  const symbolsMapBitmex = await parseCsv('../adapters/bitmex/symbolsMap.csv', data => data.reduce(
    (prev, o) => ({
      ...prev,
      [String(o['Bitmex - API name']).toUpperCase()]: {
        symbol: o.Symbol,
        name: o.Name,
        contract: o.Contract,
        classification: o.Classification,
      },
    }),
    {},
  ));

  Object.keys(symbolsMapBitmex).forEach((serviceSymbol) => {
    updateBitmexSymbolPromises.push(CfdMappingSymbolsData.updateOne(
      { serviceSymbol, serviceName: 'Bitmex' },
      {
        $set: symbolsMapBitmex[serviceSymbol],
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateBitmexSymbolPromises);

  log.info({
    message: `Bitmex number of mapping symbols ${Object.keys(symbolsMapBitmex).length}`,
  });

  // IG symbols map
  const symbolsMapIg = await parseCsv('../adapters/ig/symbolsMap.csv', data => data.reduce(
    (prev, o) => ({
      ...prev,
      [String(o['IG API symbol']).toUpperCase()]: {
        symbol: o['Symbol - Nomisma'],
        name: o.Name,
        contract: o.Contract,
        classification: o.Classification,
        base: o.Base,
        underlying: o.Underlying,
      },
    }),
    {},
  ));

  Object.keys(symbolsMapIg).forEach((serviceSymbol) => {
    updateIgSymbolPromises.push(CfdMappingSymbolsData.updateOne(
      { serviceSymbol, serviceName: 'IG' },
      {
        $set: symbolsMapIg[serviceSymbol],
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateIgSymbolPromises);

  log.info({
    message: `IG number of mapping symbols ${Object.keys(symbolsMapIg).length}`,
  });

  // Kraken symbols map
  const symbolsMapKraken = await parseCsv('../adapters/kraken/symbolsMap.csv', data => data.reduce(
    (prev, o) => ({
      ...prev,
      [o['Kraken API symbol']]: {
        symbol: o['Symbol - Nomisma'],
        name: o.Name,
        contract: o.Contract,
        classification: o.Classification,
      },
    }),
    {},
  ));

  Object.keys(symbolsMapKraken).forEach((serviceSymbol) => {
    updateKrakenSymbolPromises.push(CfdMappingSymbolsData.updateOne(
      { serviceSymbol, serviceName: 'Kraken' },
      {
        $set: symbolsMapKraken[serviceSymbol],
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateKrakenSymbolPromises);

  log.info({
    message: `Kraken number of mapping symbols ${Object.keys(symbolsMapKraken).length}`,
  });
};

export const cfdSettings = async () => {
  const cfdSettingPromises = [];
  const data = await parseCsv('./cfd-settings-generic.csv', result => result.map(row => ({
    exposure: PercentUtils.toInteger(row.Exposure),
    exposureTailored: PercentUtils.toInteger(row['Exposure (Tailored)']),
  })));
  CfdSettings.deleteMany({ section: 'common' });
  data.forEach((row) => {
    cfdSettingPromises.push(CfdSettings.updateOne(
      { section: 'common' },
      {
        $set: row,
      },
      { upsert: true },
    ));
  });
  await Promise.all(cfdSettingPromises);

  log.info({
    message: 'Cfd Settings imported',
  });
};

export const expiryDatesMapping = async () => {
  const cfdExpiryDatePromises = [];
  const expiryDates = await parseCsv('./expiry-dates-mapping.csv', data => data.map(row => ({
    contract: row.Contract,
    expiry: dateFormat(dateParse(row['Expiry Date'], 'M/D/YYYY'), 'YYYY-MM-DD'),
    original: row['Expiry Date'],
  })));
  expiryDates.forEach((row) => {
    cfdExpiryDatePromises.push(CfdExpiryDatesMappingData.updateOne(
      { contract: row.contract },
      {
        $set: {
          expiry: row.expiry,
          original: row.original,
        },
      },
      { upsert: true },
    ));
  });
  await Promise.all(cfdExpiryDatePromises);

  log.info({
    message: `Expiry Dates Mapping number of rows ${expiryDates.length}`,
  });
};

export const interestRatesFundingOffer = async () => {
  const cfdInterestRatesFundingPromises = [];
  const interestRatesFundingOfferData = await parseCsv(
    './cfd-settings-interest-rates-v1.csv',
    data => data.map(row => ({
      contract: row.Bucket,
      expiry: dateFormat(dateParse(row['Expiry Date'], 'M/D/YYYY'), 'YYYY-MM-DD'),
      expiryOriginal: row['Expiry Date'],
      USD: PercentUtils.toInteger(row.USD),
      BTC: PercentUtils.toInteger(row.BTC),
      ETH: PercentUtils.toInteger(row.ETH),
      BCH: PercentUtils.toInteger(row.BCH),
      XRP: PercentUtils.toInteger(row.XRP),
      LTC: PercentUtils.toInteger(row.LTC),
      EOS: PercentUtils.toInteger(row.EOS),
      BSV: PercentUtils.toInteger(row.BSV),
      ETC: PercentUtils.toInteger(row.ETC),
      TRX: PercentUtils.toInteger(row.TRX),
    })),
  );
  interestRatesFundingOfferData.forEach((row) => {
    const { contract, ...data } = row;
    cfdInterestRatesFundingPromises.push(CfdInterestRatesFundingOfferData.updateOne(
      { contract },
      {
        $set: data,
      },
      { upsert: true },
    ));
  });
  await Promise.all(cfdInterestRatesFundingPromises);

  log.info({
    message: `Interest Rates Funding Offer number of rows ${interestRatesFundingOfferData.length}`,
  });
};

export const fundingOfferTailored = async () => {
  const updateFundingOfferTailoredPromises = [];
  const fundingOfferTailoredData = await parseCsv(
    './cfd-settings-tailored-funding-offer.csv',
    data => data.map(row => ({
      currency: row.Currency,
      fundingOfferTailored: PercentUtils.toInteger(row['Funding Offer']),
    })),
  );
  fundingOfferTailoredData.forEach((row) => {
    const { currency, ...data } = row;
    updateFundingOfferTailoredPromises.push(CfdFundingOfferTailoredData.updateOne(
      { currency },
      {
        $set: data,
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateFundingOfferTailoredPromises);

  log.info({
    message: `Funding Offer Tailored number of rows ${fundingOfferTailoredData.length}`,
  });
};

export const crossCurrencyBasis = async () => {
  const updateCrossCurrencyBasisPromises = [];
  const crossCurrencyBasisData = await parseCsv('./cfd-settings-cross-currency-basis.csv', data => data.map(row => ({
    contract: row.Bucket,
    expiry: dateFormat(dateParse(row['Expiry Date'], 'M/D/YYYY'), 'YYYY-MM-DD'),
    expiryOriginal: row['Expiry Date'],
    USD: PercentUtils.toInteger(row.USD),
    BTC: PercentUtils.toInteger(row.BTC),
    ETH: PercentUtils.toInteger(row.ETH),
    BCH: PercentUtils.toInteger(row.BCH),
    XRP: PercentUtils.toInteger(row.XRP),
    LTC: PercentUtils.toInteger(row.LTC),
    EOS: PercentUtils.toInteger(row.EOS),
    BSV: PercentUtils.toInteger(row.BSV),
    ETC: PercentUtils.toInteger(row.ETC),
    TRX: PercentUtils.toInteger(row.TRX),
  })));
  crossCurrencyBasisData.forEach((row) => {
    const { contract, ...data } = row;
    updateCrossCurrencyBasisPromises.push(CfdCrossCurrencyBasisData.updateOne(
      { contract },
      {
        $set: data,
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateCrossCurrencyBasisPromises);
  log.info({
    message: `Cross Currency Basis number of rows ${crossCurrencyBasisData.length}`,
  });
};

export const defaultRecoveryUpon = async () => {
  const updateCfdDefaultRecoveryPromises = [];
  const defaultRecoveryUponData = await parseCsv('./cfd-settings-default-recovery-upon.csv', data => data.map(row => ({
    serviceName: row.Service,
    recovery: PercentUtils.toInteger(row.Recovery),
  })));
  defaultRecoveryUponData.forEach((row) => {
    const { serviceName, ...data } = row;
    updateCfdDefaultRecoveryPromises.push(CfdDefaultRecoveryUponData.updateOne(
      { serviceName },
      {
        $set: data,
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateCfdDefaultRecoveryPromises);

  log.info({
    message: `Default Recovery Upon number of rows ${defaultRecoveryUponData.length}`,
  });
};

export const requiredInitialMargin = async () => {
  const updateDefaultRecoveryPromises = [];
  const defaultRecoveryUponData = await parseCsv('./cfd-settings-required-initial-margin.csv',
    data => data.map(row => ({
      serviceName: row.Service,
      requiredMargin: PercentUtils.toInteger(row['Required Initial Margin']),
    })));

  defaultRecoveryUponData.forEach((row) => {
    const { serviceName, ...data } = row;
    updateDefaultRecoveryPromises.push(CfdRequiredInitialMarginData.updateOne(
      { serviceName },
      {
        $set: data,
      },
      { upsert: true },
    ));
  });
  await Promise.all(updateDefaultRecoveryPromises);

  log.info({
    message: `Required Initial Margin number of rows ${defaultRecoveryUponData.length}`,
  });
};
