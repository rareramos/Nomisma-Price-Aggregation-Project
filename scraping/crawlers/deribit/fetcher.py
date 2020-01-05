import re
import os
from time import sleep

from scraping import logger
from scraping.utils.common.web_driver import WebDriver
from scraping.utils.common.database import Database
from scraping.utils.common.jsparser import JSParser
from scraping.symbol_maps import symbol_maps_loader
from scraping.utils.deribit.constants import service_name


class DeribitFetcher:
    knowledge_base_sidebar_x = '//ul[contains(@class, "page-sidebar-menu")]//li[contains(., "Knowledge Base")]'
    raw_fees_css = '.page-content'
    contract_fees_r = r'{}[\w\s\+]+?{}[\w\s\+]+?\s*Maker Rebate: ([\d\.]+)%\nTaker Fee:\s*([\d\.]+)%'
    fees_section_x = '//a[contains(@class, "nav-link") and contains(., "Fees")]'
    contract_specifications_x = '//a[contains(@class, "dropdown-item") and contains(., "{}")]'
    specifications_table_x_t = '//h2[contains(., "{} {}")]/following-sibling::table'
    initial_margin_x = './/tr[contains(., "Initial margin")]//td[last()]'
    trading_fees_x = './/tr[contains(., "Fees")]//td[last()]'
    available_contracts = {}
    underlying_currencies = {}
    contract_fees = {}
    symbols_map = {}

    def __init__(self, config):
        self.db = Database()

        self.driver = WebDriver().get_driver()

        self.base_url = config['base_url']
        self.username = config['PRICE_AGG_DERIBIT_USERNAME']
        self.password = config['PRICE_AGG_DERIBIT_PASSWORD']

        self.login_wait = int(config['delays']['login_page'])
        self.tab_opening_wait = int(config['delays']['tab_opening'])
        logger.log('Configurations successfully loaded for deribit.com')

        self.symbols_map = symbol_maps_loader.fetch_map_from_db(service_name)
        logger.log('Symbol Maps loaded successfully')

    def login(self):
        if not self.username or not self.password:
            return False

        driver = self.driver
        driver.get(self.base_url)
        driver.maximize_window()
        driver.find_element_by_id('inputEmail').send_keys(self.username)
        driver.find_element_by_id('inputPassword').send_keys(self.password)
        driver.find_element_by_id('submitBtn').click()
        logger.log('logged in successfully!')
        sleep(self.login_wait)
        return True

    def get_contracts(self):
        raw_contract_types = re.findall(r'window.deribit = ({[\s\S]*?});', self.driver.page_source)
        for product in JSParser('var x = ' + raw_contract_types[0])['x']['products']:
            instrument = product['instruments'][0]

            underlying_currency = self._get_underlying_currency(instrument['displayName'])
            self.underlying_currencies.update({product['currency']: underlying_currency})

            contracts = [f'{contract["displayNameSection"]}' for contract in instrument['list']]
            self.available_contracts.update({product['currency']: contracts})
        logger.log('available contracts loaded')

    def _get_future_contracts(self, crypto_currency):
        logger.log('getting future contracts from available contracts')
        future_contracts = self.available_contracts[crypto_currency].copy()
        future_contracts.remove('Perpetual')
        return future_contracts

    def open_knowledge_base(self):
        logger.log('opening knowledge base section')
        driver = self.driver
        driver.find_element_by_xpath(self.knowledge_base_sidebar_x).click()
        sleep(self.tab_opening_wait)
        driver.switch_to.window(driver.window_handles[1])
        sleep(self.tab_opening_wait)

    def open_fees_page(self):
        logger.log('opening fees section')
        driver = self.driver
        driver.find_element_by_xpath(self.fees_section_x).click()
        sleep(self.tab_opening_wait)

    def load_contract_fees(self):
        logger.log('getting contract fees i.e., maker Fees and taker Fees')
        driver = self.driver
        raw_fees = driver.find_element_by_css_selector(self.raw_fees_css).text
        for currency in self.available_contracts:
            self.contract_fees.update({currency: {}})
            for contract in self.available_contracts[currency]:
                regex = self.contract_fees_r.format(currency, 'Futures?' if contract != 'Perpetual' else contract)
                self.contract_fees[currency].update({contract: self._get_fees(raw_fees, regex)})

    def _get_fees(self, raw_fees, regex):
        raw_fees = re.findall(regex, raw_fees, flags=re.I)
        maker_fee, taker_fee = raw_fees[0] if raw_fees else ('', '')

        return {
            'makerFee': float(maker_fee) if maker_fee else None,
            'takerFee': float(taker_fee) * -1.0 if taker_fee else None,
        }

    def _open_contract_specifications(self, contract):
        logger.log(f'opening contract specs for {contract}')
        driver = self.driver
        driver.find_element_by_id('navbarDropdownMenuLink-contractSpec').click()
        driver.find_element_by_xpath(self.contract_specifications_x.format(contract)).click()
        sleep(self.tab_opening_wait)

    def persist_quasi_live_data(self, contract_type):
        quasi_live_data = []
        self._open_contract_specifications(contract_type)
        for crypto_currency in self.available_contracts:
            relevant_contracts = self._get_relevant_contracts(crypto_currency, contract_type)
            for contract in relevant_contracts:
                margin = self._get_initial_margin(crypto_currency, "Futures" if contract != "Perpetual" else contract)

                payload = self.contract_fees[crypto_currency][contract]
                payload.update({'margin': margin, 'marginCcy': crypto_currency})

                symbol = self._get_symbol(crypto_currency, contract)

                filters = {
                    'serviceName': service_name,
                    'scrapingSymbol': symbol
                }
                filters.update(self.symbols_map.get(symbol, {}))

                if os.environ.get('PRICE_AGG_RUN_ENV') == 'TEST':
                    quasi_live_data.append((filters, payload))
                else:
                    logger.log(f'persisting quasi-live data for {symbol} into mongo DB')
                    self.db.persist_data(filters, payload)

        return quasi_live_data

    def _get_initial_margin(self, crypto_currency, contract):
        logger.log(f'getting initial margin for {crypto_currency} {contract}')
        driver = self.driver
        table_x = self.specifications_table_x_t.format(crypto_currency, contract)
        specifications_table = driver.find_element_by_xpath(table_x)

        initial_margin = specifications_table.find_element_by_xpath(self.initial_margin_x).text

        return self._get_m_margin(initial_margin)

    def _get_m_margin(self, m_margin):
        return float(re.findall(r'Starting with ([\d\.]+)\s*%', m_margin)[0])

    def _get_underlying_currency(self, raw_currency_pair):
        underlying_currency = re.findall(r'[A-Z]{3}\s*-\s*([A-Z]{3})', raw_currency_pair)[0]
        return underlying_currency.upper()

    def close_browser(self):
        logger.log('Closing browser')
        self.driver.quit()

    def _get_symbol(self, crypto_currency, contract):
        return f'{crypto_currency}/{self.underlying_currencies[crypto_currency]} - {contract}'

    def _get_relevant_contracts(self, crypto_currency, contract_type):
        return self._get_future_contracts(crypto_currency) if contract_type == 'Futures' else ['Perpetual']
