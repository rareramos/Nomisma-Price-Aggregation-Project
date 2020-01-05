import re
from time import sleep
from itertools import cycle

from selenium.common.exceptions import ElementNotInteractableException, NoSuchElementException
from selenium.common.exceptions import ElementClickInterceptedException

from scraping import logger
from scraping.utils.common.web_driver import WebDriver
from scraping.utils.common.mappings import currencies_map
from scraping.utils.common.database import Database
from scraping.utils.common.socket import WebSocket
from scraping.utils.cmc.constants import service_name, underlying_currency, target_currencies


class CMCFetcher:
    live_price_x_t = (
        '//div[@cmc-table-scroll-container]//div[contains(@class, "product-name") and '
        'contains(., "{} (USD)")]/following-sibling::div[contains(@class, "bid-offer-price")]'
        '//span[contains(@class, "{}")]'
    )
    product_menu_css_t = '.product-name-child[title="{} (USD)"] .context-menu-button'
    open_product_overview_x = '//li[contains(@class, "menu-item") and contains(., "Product Overview")]'
    close_product_overview_x = (
        '//div[contains(@class, "feature-product-search")]/ancestor:'
        ':header//button[contains(@class, "close-button")]'
    )
    m_margin_css = '.margin-rate [cmc-bind="values.marginRate"]'
    daily_funding_long_css = '.holding-costs .row-buy .column.yearly.down'
    daily_funding_short_css = '.holding-costs .row-sell .column.yearly.up'

    get_premium_popup_css = '.rich-in-platform-message-container__buttons .link-new-secondary'

    def __init__(self, config):
        self.db = Database()
        self.ws = WebSocket()

        self.driver = WebDriver().get_driver()
        self.base_url = config['base_url']
        self.username = config['PRICE_AGG_CMC_USERNAME']
        self.password = config['PRICE_AGG_CMC_PASSWORD']

        self.product_overview_wait = int(config['delays']['product_overview'])
        self.crypto_library_wait = int(config['delays']['crypto_library'])
        self.is_premium_account = config['premium_account']

        self.live_data_payload = {
            'serviceName': service_name,
            'underlying': underlying_currency
        }

        logger.log(f'Fetched configurations for {self.live_data_payload["serviceName"]}')

    def login(self):
        if not self.username or not self.password:
            return False

        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_id('username').send_keys(self.username)
        driver.find_element_by_id('password').send_keys(self.password)
        driver.find_element_by_css_selector('input.link-new-primary').click()

        logger.log('Successfully logged in!')
        sleep(self.crypto_library_wait)

        driver.find_element_by_css_selector('.account-not-corporate').click()

        # a pop-up appears for non premium accounts
        sleep(0 if self.is_premium_account else self.crypto_library_wait)
        try:
            driver.find_element_by_css_selector(self.get_premium_popup_css).click()
        except NoSuchElementException:
            pass

        return True

    def open_crypto_library(self):
        driver = self.driver
        driver.find_element_by_css_selector('.Products').click()

        logger.log('Product library click executed')
        sleep(self.crypto_library_wait)

        try:
            driver.find_element_by_css_selector('.Crypto').click()
            logger.log('Crypto library click executed')
        except ElementNotInteractableException:
            logger.log('Crypto library already opened')

        sleep(self.crypto_library_wait)

    def persist_quasi_live_data(self, contract='PERPETUAL'):
        for crypto_currency in target_currencies:
            quasi_live_data = self._get_quasi_live_data(crypto_currency)

            filters = {
                'symbol': f'{quasi_live_data["marginCcy"]}/{underlying_currency}',
                'contract': contract,
                'serviceName': service_name,
            }
            self.db.persist_data(filters, quasi_live_data)
            logger.log(
                f'Quasi live data from {filters["serviceName"]} for '
                f'{currencies_map[crypto_currency]}-{underlying_currency} persisted to mongo DB'
            )

    def publish_live_prices(self):
        for crypto_currency in cycle(target_currencies):
            live_prices = self._get_live_prices(crypto_currency)
            self.live_data_payload.update(live_prices)
            self.ws.publish_data(self.live_data_payload)
            logger.log(
                f'Live price from {self.live_data_payload["serviceName"]} for '
                f'{currencies_map[crypto_currency]}-{underlying_currency} is published'
            )

    def _get_live_prices(self, crypto_currency):
        driver = self.driver
        bid_x = self.live_price_x_t.format(crypto_currency, 'bid')
        offer_x = self.live_price_x_t.format(crypto_currency, 'offer')
        live_prices = {
            'base': currencies_map[crypto_currency],
            'bid': float(driver.find_element_by_xpath(bid_x).text.replace(',', '')),
            'offer': float(driver.find_element_by_xpath(offer_x).text.replace(',', '')),
        }
        return live_prices

    def _get_quasi_live_data(self, crypto_currency):
        driver = self.driver
        driver.find_element_by_css_selector(self.product_menu_css_t.format(crypto_currency)).click()
        driver.find_element_by_xpath(self.open_product_overview_x).click()

        sleep(self.product_overview_wait)  # Waiting for fields to get populated

        m_margin = self._process_m_margin(driver.find_element_by_css_selector(self.m_margin_css).text)

        yearly_funding_long = driver.find_element_by_css_selector(self.daily_funding_long_css).text
        daily_funding_long = self._calculate_daily_fundings(yearly_funding_long)

        yearly_funding_short = driver.find_element_by_css_selector(self.daily_funding_short_css).text
        daily_funding_short = self._calculate_daily_fundings(yearly_funding_short)

        driver.find_element_by_xpath(self.close_product_overview_x).click()

        quasi_live_data = {
            'margin': m_margin,
            'fundingLong': daily_funding_long,
            'fundingShort': daily_funding_short,
            'marginCcy': currencies_map[crypto_currency],
        }

        logger.log(f'Quasi live data scraped for ' f'{currencies_map[crypto_currency]}-{underlying_currency}')
        return quasi_live_data

    def _calculate_daily_fundings(self, raw_daily_fundings):
        daily_fundings = float(re.findall(r'([+\-\d\.]+)\s*%', raw_daily_fundings)[0])
        return f'{daily_fundings/365.0:.5f}%'

    def _process_m_margin(self, m_margin):
        return re.findall(r'(\d+%)', m_margin)[0]

    def close_menus(self):
        driver = self.driver
        try:
            driver.find_element_by_css_selector('.header-item__button[title="Close"]').click()
            self.close_menus()
        except ElementClickInterceptedException:
            driver.find_element_by_css_selector('.feature-product-library .header-item__button.close-button').click()
            self.close_menus()
        except NoSuchElementException:
            logger.log('All opened menus closed')

    def _logout(self):
        self.driver.find_element_by_css_selector('.icon-logout.Session').click()
        logger.log('Logging out')

    def close_browser(self):
        self.driver.quit()
        logger.log('Closing the browser')

    def clean_dashboard(self):
        self.close_menus()
        self._logout()
        self.close_browser()
