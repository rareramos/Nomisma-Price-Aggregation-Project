import re
import json
from os import environ as os_environ
from time import sleep

import requests

from scraping import logger
from scraping.symbol_maps import symbol_maps_loader
from scraping.utils.common.web_driver import WebDriver
from scraping.utils.common.database import Database
from scraping.utils.okex.constants import service_name


class OkexFetcher:
    open_swap_overview_x = '//ul[contains(@class, "list-main")]//li[contains(., "{}Swap")]'
    funding_rate_css = '//div[contains(@class, "trade-top-info-left")]//*[contains(., "Current Funding Rate")]'
    margin_ccy_css = '.percent-line + .info-line .info-left .value'
    m_margin_css = '.swap-setting-lever-rate strong'
    perpetual_maker_fee_css = '#normalFeeList > tr:nth-child(1) > td:nth-child(10)'
    futures_maker_fee_css = '#normalFeeList > tr:nth-child(1) > td:nth-child(7)'
    perpetual_taker_fee_css = '#normalFeeList > tr:nth-child(1) > td:nth-child(11)'
    futures_taker_fee_css = '#normalFeeList > tr:nth-child(1) > td:nth-child(8)'
    trading_fees = {'Perpetual': {}, 'Futures': {}}
    available_contracts_map = {'Perpetual': [], 'Futures': []}

    def __init__(self, config):
        self.db = Database()

        self.driver = WebDriver().get_driver()

        self.base_url = config['base_url']
        self.future_contracts_url = config['future_contracts_url']
        self.perpetual_contracts_url = config['perpetual_contracts_url']
        self.trading_fees_url = config['trading_fees_url']

        self.swap_overview_wait = int(config['delays']['swap_overview'])
        self.trading_fees_wait = int(config['delays']['trading_fee'])

        logger.log(f'Configurations successfully loaded for {service_name}')

        self.symbols_map = symbol_maps_loader.fetch_map_from_db(service_name)
        logger.log(f'Symbol Maps loaded successfully for {service_name}')

    def load_perpetual_contracts(self):
        logger.log('Loading available Perpetual contracts')
        raw_contracts = requests.get(self.perpetual_contracts_url)

        for raw_contract in json.loads(raw_contracts.text)['data']:
            self.available_contracts_map['Perpetual'].append(f"{raw_contract['coinName']} Swap")

    def load_future_contracts(self):
        logger.log('Loading available Future Contracts')
        raw_contracts = requests.post(self.future_contracts_url)

        for raw_contract in json.loads(raw_contracts.text)['data']['contracts']:
            self.available_contracts_map['Futures'].append(raw_contract['desc'])

    def load_trading_fees(self):
        logger.log('Loading Trading Fees')

        driver = self.driver
        driver.get(self.trading_fees_url)

        sleep(self.trading_fees_wait)  # Waiting for fields to get populated

        maker_fee = self._process_trading_fees(driver.find_element_by_css_selector(self.perpetual_maker_fee_css).text)
        taker_fee = self._process_trading_fees(driver.find_element_by_css_selector(self.perpetual_taker_fee_css).text)
        self.trading_fees['Perpetual'].update({'makerFee': maker_fee, 'takerFee': taker_fee})

        maker_fee = self._process_trading_fees(driver.find_element_by_css_selector(self.futures_maker_fee_css).text)
        taker_fee = self._process_trading_fees(driver.find_element_by_css_selector(self.futures_taker_fee_css).text)
        self.trading_fees['Futures'].update({'makerFee': maker_fee, 'takerFee': taker_fee})

    def persist_quasi_live_data(self, contract_type='Perpetual'):
        quasi_live_data = []

        for contract in self.available_contracts_map[contract_type]:
            filters = {
                'scrapingSymbol': contract,
                'serviceName': service_name
            }

            mapping = self.symbols_map.get(contract)
            if mapping and mapping['pair'] != "Exclude on Combined Table":
                filters.update(mapping)

            payload = self.trading_fees[contract_type]

            if os_environ.get('PRICE_AGG_RUN_ENV') == 'TEST':
                quasi_live_data.append((filters, payload))
            else:
                logger.log(f'Persisting Quasi-live data for {contract} into mongo DB')
                self.db.persist_data(filters, payload)

        return quasi_live_data

    def _process_trading_fees(self, raw_fee):
        return float(re.findall(r'([+\-\d\.]+)\s*%', raw_fee)[0]) * -1.0

    def close_browser(self):
        self.driver.quit()
        logger.log(f'Closing the browser')
