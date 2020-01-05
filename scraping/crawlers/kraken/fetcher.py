import re
import os
import json

from requests import get as get_request
from bs4 import BeautifulSoup

from scraping import logger
from scraping.utils.common.mappings import symbols_map
from scraping.utils.common import sanitize
from scraping.utils.common.database import Database
from scraping.symbol_maps import symbol_maps_loader
from scraping.utils.kraken.constants import service_name


class KrakenFetcher:
    trading_fees_css = 'div.article-body tr:contains("Fee Structure") td'
    trading_fees_re_t = r'([\-\d\.]+)%?\s*{}'
    margin_css_t = (
        'table.description:contains("{} Contract Margin Levels") '
        'tr:contains("Margin Parameters for Retail Clients")'
        '~ tr td:contains("Initial Margin") + td'
    )
    contract_symbols_css = {
        'Perpetual': 'tr:contains("Contract Symbol") td:first-child ~ td',
        'Futures': 'tr:nth-child(2) td:first-child ~ td',
    }
    margin_currency_css = 'tr:contains("Margin"):contains("Settlement Currency") td:first-child ~ td'
    available_contracts = []
    margin_currencies_map = {}
    trading_fees = {}

    def __init__(self, config):
        self.db = Database()

        self.instruments_url = config['instruments_url']
        self.margin_schedule_url = config['margin_schedule_url']

        self.contract_specs_url = {
            'Perpetual': config['perpetual_contract_specs_url'],
            'Futures': config['futures_contract_specs_url'],
        }

        logger.log(f'Configurations successfully loaded for {service_name}')

        self.symbols_map = symbol_maps_loader.fetch_map_from_db(service_name)
        logger.log('Symbol Maps loaded successfully')

    def load_contracts(self):
        raw_contracts = get_request(self.instruments_url)

        for raw_contract in json.loads(raw_contracts.text)['instruments']:
            if not raw_contract['tradeable']:
                continue

            self.available_contracts.append(raw_contract['symbol'])

        logger.log('Contracts loaded successfully!')

    def persist_quasi_live_data(self):
        quasi_live_data = []
        common_payload = self.trading_fees.copy()
        initial_margin = self._get_initial_margin()

        for crypto_currency in self.available_contracts:
            payload = common_payload.copy()
            mapping = self.symbols_map.get(crypto_currency, {})

            payload.update({
                'margin': initial_margin.get(mapping.get('expiry'), initial_margin['futures']),
                'marginCcy': self.margin_currencies_map[crypto_currency[:9]],
            })

            filters = {
                'serviceName': service_name,
                'scrapingSymbol': crypto_currency
            }
            filters.update(mapping)

            if os.environ.get('PRICE_AGG_RUN_ENV') == 'TEST':
                quasi_live_data.append((filters, payload))
            else:
                logger.log(f'persisting quasi-live data for {crypto_currency} into mongo DB')
                self.db.persist_data(filters, payload)

        return quasi_live_data

    def get_trading_fees(self, response):
        raw_trading_fees = response.select(self.trading_fees_css)[1].get_text()
        maker_fee = self._process_trading_fees('Maker', raw_trading_fees)
        taker_fee = self._process_trading_fees('Taker', raw_trading_fees)

        self.trading_fees.update({'makerFee': float(maker_fee[0])} if maker_fee else {})
        self.trading_fees.update({'takerFee': float(taker_fee[0])} if taker_fee else {})

        logger.log("Trading fees i.e., makerFee and takerFee are loaded successfully")

    def _get_initial_margin(self):
        logger.log('Initial Margins loaded successfully')
        response = self._get_request(self.margin_schedule_url)
        perpetual_margin = response.select(self.margin_css_t.format('Perpetual'))[0].get_text()
        futures_margin = response.select(self.margin_css_t.format('Fixed Maturity'))[0].get_text()
        margin = {
            'Perpetual': self._process_initial_margin(perpetual_margin),
            'futures': self._process_initial_margin(futures_margin),
        }

        return margin

    def get_contract_specs(self, contract_type):
        response = self._get_request(self.contract_specs_url[contract_type])

        contract_symbols = self._get_contract_symbols(response, contract_type)
        margin_currencies = self._get_margin_currencies(response)

        self._update_margin_currencies(contract_symbols, margin_currencies)

        logger.log(f'{contract_type} Contract Specs loaded successfully')

        return response

    def _get_contract_symbols(self, response, contract_type):
        return [sanitize(sym.text).lower() for sym in response.select(self.contract_symbols_css[contract_type])]

    def _get_margin_currencies(self, response):
        return [sanitize(sym.text) for sym in response.select(self.margin_currency_css)]

    def _process_trading_fees(self, fee, raw_trading_fees):
        return re.findall(self.trading_fees_re_t.format(fee), raw_trading_fees)

    def _process_initial_margin(self, raw_margin):
        initial_margin = sanitize(re.findall(r'(\d+)', raw_margin)[0])
        return float(initial_margin)

    def _update_margin_currencies(self, contract_symbols, margin_currencies):
        for symbol, margin_currency in zip(contract_symbols, margin_currencies):
            currency = symbols_map.get(margin_currency, margin_currency)
            self.margin_currencies_map.update({symbol: currency})

    def _get_request(self, url):
        raw_response = get_request(url=url)
        return BeautifulSoup(raw_response.text, "html.parser")
