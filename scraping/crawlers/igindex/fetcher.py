import os
from time import sleep

from scraping import logger
from scraping.utils.common.web_driver import WebDriver
from scraping.symbol_maps import symbol_maps_loader
from scraping.utils.common.database import Database
from scraping.utils.igindex.constants import service_name


class IGIndexFetcher:
    login_btn_css = 'input#loginbutton'
    username_element_name = 'account_id'
    password_element_name = 'nonEncryptedPassword'
    dashboard_tab_css = '[ig-click-tracking="navigationLinkRedNav-dashboard"]'
    cfd_platform_x = (
        '//*[contains(@class, "name-value") and contains(., "CFD")]/'
        'following-sibling::*//a[@ng-click="controller.openFirstPlatform()"]'
    )
    crypto_currency_tab_css = '.platform-navigation_menu-item--CRYPTOCURRENCY'
    available_crypto_currencies_css = '.browse-flyout--cryptocurrency  .cell-market-name_name'

    def __init__(self, config):
        self.db = Database()
        self.driver = WebDriver().get_driver()
        self.base_url = config['base_url']
        self.username = config['PRICE_AGG_IGINDEX_USERNAME']
        self.password = config['PRICE_AGG_IGINDEX_PASSWORD']
        self.login_wait = config['delays']['login']

        logger.log(f'Fetched configurations for {service_name}')

        self.symbols_map = symbol_maps_loader.fetch_map_from_db(service_name)
        logger.log(f'Symbol Maps loaded successfully for {service_name}')

    def login(self):
        if not self.username or not self.password:
            return False

        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_name(self.username_element_name).send_keys(self.username)
        driver.find_element_by_name(self.password_element_name).send_keys(self.password)
        driver.find_element_by_css_selector(self.login_btn_css).click()
        logger.log('Successfully logged in!')
        sleep(self.login_wait)

        return True

    def open_platform(self):
        logger.log('Opening crypto currency platform')
        driver = self.driver
        driver.find_element_by_css_selector(self.dashboard_tab_css).click()
        driver.find_element_by_xpath(self.cfd_platform_x).click()
        driver.find_element_by_css_selector(self.crypto_currency_tab_css).click()

    def load_available_contracts(self):
        quasi_live_data = []
        driver = self.driver
        logger.log('Loading Available Contracts')
        for crypto_elem in driver.find_elements_by_css_selector(self.available_crypto_currencies_css):
            crypto_currency = crypto_elem.text
            filters = {
                'scrapingSymbol': crypto_currency,
                'serviceName': service_name
            }

            mapping = self.symbols_map.get(crypto_currency, {})
            payload = mapping.copy()

            if os.environ.get('PRICE_AGG_RUN_ENV') == 'TEST':
                quasi_live_data.append((filters, payload))
            else:
                logger.log(f'Persisting data for {crypto_currency}')
                self.db.persist_data(filters, payload)

        return quasi_live_data

    def close_browser(self):
        self.driver.quit()
        logger.log('Closing the browser')
