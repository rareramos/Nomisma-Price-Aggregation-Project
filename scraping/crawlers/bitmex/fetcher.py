import os
import re
import json

from scraping import logger
from scraping.utils.common.web_driver import WebDriver
from scraping.utils.common.database import Database
from scraping.symbol_maps import symbol_maps_loader
from scraping.utils.bitmex.constants import service_name


class BitmexFetcher:
    def __init__(self, config):
        self.db = Database()
        self.driver = WebDriver(javascript_enabled=False).get_driver()
        self.base_url = config['base_url']

        logger.log(f'Fetched configurations for {service_name}')

        self.symbols_map = symbol_maps_loader.fetch_map_from_db(service_name)
        logger.log(f'Symbol Maps loaded successfully for {service_name}')

    def open_live_trading(self):
        driver = self.driver
        driver.get(self.base_url)
        logger.log('Successfully logged in!')
        return True

    def load_available_contracts(self):
        quasi_live_data = []
        driver = self.driver
        raw_contracts = re.findall('<script id="initialData".*?>(.*?)</script>', driver.page_source)[0]

        for instrument in json.loads(raw_contracts)['instruments']:
            if instrument['state'] == 'Open' and not instrument['symbol'].startswith('XBT7D'):
                filters = {
                    'scrapingSymbol': instrument['symbol'],
                    'serviceName': service_name
                }

                mapping = self.symbols_map.get(instrument['symbol'], {})
                payload = mapping.copy()

                if os.environ.get('PRICE_AGG_RUN_ENV') == 'TEST':
                    quasi_live_data.append((filters, payload))
                else:
                    logger.log(f"persisting quasi-live data for {instrument['symbol']} into mongo DB")
                    self.db.persist_data(filters, payload)

        return quasi_live_data

    def close_browser(self):
        self.driver.quit()
        logger.log('Closing the browser')
