/* eslint-disable no-nested-ternary */
import numeral from 'numeral';
import { instrumentColumns } from '../../utils/instruments';

export const selectColumns = () => instrumentColumns;

export const selectServices = () => ['Deribit', 'Bitmex', 'IG', 'Kraken'];

export const unflattenData = data => Object.values(data)
  .reduce((prev, symbolData) => [...prev, ...Object.values(symbolData)], []);

export const selectUnmatchedCount = (
  instruments,
  serviceName,
) => unflattenData(instruments.unmatched).filter(row => row.serviceName === serviceName).length;


export const selectMatchedCount = (instruments, serviceName) => unflattenData(instruments.quasiLive).filter(
  row => row.serviceName === serviceName && row.matched === true,
).length;

export const selectApiData = (data, serviceName) => unflattenData(data)
  .filter(row => row.serviceName === serviceName)
  .map(row => ({
    serviceName: row.serviceName,
    serviceSymbol: row.serviceSymbol,
    scrapingSymbol: 'N/A',
    name: row.name,
    expiry: row.contract, // row.expiry ? format(new Date(row.expiry), 'DD/MM/YYYY') : 'Perpetual',
    symbol: row.symbol,
    classification: row.classification,
    bid: row.bid ? numeral(row.bid).format('0,0.00[000000]') : '',
    offer: row.offer ? numeral(row.offer).format('0,0.00[000000]') : '',
    fundingLong: row.fundingLong ? numeral(row.fundingLong / 100).format('%0.00[000000]') : 'N/A',
    fundingShort: row.fundingShort ? numeral(row.fundingShort / 100).format('%0.00[000000]') : 'N/A',
  }));

export const selectScrapingData = (data, serviceName) => unflattenData(data)
  .filter(row => row.serviceName === serviceName)
  .map(row => ({
    serviceName: row.serviceName,
    serviceSymbol: 'N/A',
    scrapingSymbol: row.symbolScraping,
    name: row.pair,
    expiry: row.expiry,
    symbol: row.symbolNomisma,
    classification: row.classification,
    bid: '',
    offer: '',
    makerFee: row.makerFee ? numeral(row.makerFee / 100).format('%0.00[000000]') : 'N/A',
    takerFee: row.takerFee ? numeral(row.takerFee / 100).format('%0.00[000000]') : 'N/A',
    margin: numeral(row.margin / 100).format('%0'),
    marginCcy: row.marginCcy,
  }));

export const selectCombinedData = (data, serviceName) => unflattenData(data)
  .filter(row => row.serviceName === serviceName && row.matched === true)
  .map(row => ({
    serviceName: row.serviceName,
    serviceSymbol: row.serviceSymbol,
    scrapingSymbol: row.symbolScraping,
    name: row.name,
    expiry: row.contract, // row.expiry ? format(new Date(row.expiry), 'DD/MM/YYYY') : 'Perpetual',
    symbol: row.symbol,
    classification: row.classification,
    bid: row.bid ? numeral(row.bid).format('0,0.00[000000]') : '',
    offer: row.offer ? numeral(row.offer).format('0,0.00[000000]') : '',
    fundingLong: row.fundingLong ? numeral(row.fundingLong / 100).format('%0.00[000000]') : 'N/A',
    fundingShort: row.fundingShort ? numeral(row.fundingShort / 100).format('%0.00[000000]') : 'N/A',
    makerFee: row.makerFee ? numeral(row.makerFee / 100).format('%0.00[000000]') : 'N/A',
    takerFee: row.takerFee ? numeral(row.takerFee / 100).format('%0.00[000000]') : 'N/A',
    margin: numeral(row.margin / 100).format('%0'),
    marginCcy: row.marginCcy,
  }));

export const selectUnmatchedApiData = (data, serviceName) => unflattenData(data)
  .filter(row => row.serviceName === serviceName && row.from === 'api')
  .map(row => ({
    serviceName: row.serviceName,
    serviceSymbol: row.serviceSymbol || 'N/A',
    scrapingSymbol: row.symbolScraping || 'N/A',
    name: row.name || row.pair,
    expiry: row.expiry || row.contract,
    symbol: row.symbol || row.symbolNomisma,
    classification: row.classification,
    bid: row.bid ? numeral(row.bid).format('0,0.00[000000]') : '',
    offer: row.offer ? numeral(row.offer).format('0,0.00[000000]') : '',
    fundingLong: 'N/A',
    fundingShort: 'N/A',
    makerFee: '',
    takerFee: '',
    margin: '',
    marginCcy: '',
  }));

export const selectUnmatchedScrapingData = (data, serviceName) => unflattenData(data)
  .filter(row => row.serviceName === serviceName && row.from === 'scraping')
  .map(row => ({
    serviceName: row.serviceName,
    serviceSymbol: row.serviceSymbol || 'N/A',
    scrapingSymbol: row.symbolScraping || 'N/A',
    name: row.name || row.pair,
    expiry: row.expiry || row.contract,
    symbol: row.symbol || row.symbolNomisma,
    classification: row.classification,
    bid: row.bid ? numeral(row.bid).format('0,0.00[000000]') : '',
    offer: row.offer ? numeral(row.offer).format('0,0.00[000000]') : '',
    fundingLong: 'N/A',
    fundingShort: 'N/A',
    makerFee: '',
    takerFee: '',
    margin: '',
    marginCcy: '',
  }));

export const selectServicesData = (state) => {
  const services = selectServices();
  return services.reduce((prev, serviceName) => {
    const combinedData = selectCombinedData(state.instruments.quasiLive, serviceName);
    const apiData = selectApiData(state.instruments.quasiLive, serviceName);
    const countApiInstruments = apiData.length;
    const scrapingData = selectScrapingData(state.instruments.scraping, serviceName);
    const countScrapingInstuments = scrapingData.length;
    const unmatchedApiData = selectUnmatchedApiData(state.instruments.unmatched, serviceName);
    const unmatchedScrapingData = selectUnmatchedScrapingData(
      state.instruments.unmatched,
      serviceName,
    );
    const unmatched = selectUnmatchedCount(state.instruments, serviceName);
    const matched = selectMatchedCount(state.instruments, serviceName);
    const status = unmatched === 0
      && matched > 0
      && countApiInstruments === countScrapingInstuments
      && matched === countApiInstruments;
    return {
      ...prev,
      [serviceName]: {
        status,
        matched,
        unmatched,
        combinedData,
        apiData,
        scrapingData,
        unmatchedApiData,
        unmatchedScrapingData,
      },
    };
  }, {});
};
