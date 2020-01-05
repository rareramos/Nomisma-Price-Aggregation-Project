import unittest

from scraping.crawlers.kraken.fetcher import KrakenFetcher
from scraping.configs import configs_adapter


class TestKrakenCrawler(unittest.TestCase):
    def setUp(self):
        config = configs_adapter.load_config('kraken', [])
        self.crawler = KrakenFetcher(config)

    def test_crawler(self):
        self.crawler.load_contracts()
        self.assertTrue(self.crawler.available_contracts, 'Available contracts not loaded successfully')

        self.crawler.get_contract_specs('Futures')
        future_margin_currencies = self.crawler.margin_currencies_map.copy()
        self.assertTrue(future_margin_currencies, 'Future margin currencies map not laoded successfully')

        self.crawler.margin_currencies_map = {}

        response = self.crawler.get_contract_specs('Perpetual')
        self.assertTrue(self.crawler.margin_currencies_map, 'Perpetual margin currencies map not loaded successfully')

        self.crawler.margin_currencies_map.update(future_margin_currencies)

        self.crawler.get_trading_fees(response)

        self.assert_in_and_not_empty('makerFee', self.crawler.trading_fees)
        self.assert_in_and_not_empty('takerFee', self.crawler.trading_fees)

        for filters, payload in self.crawler.persist_quasi_live_data():
            self.assert_in_and_not_empty('nomismaSymbol', filters)
            self.assert_in_and_not_empty('scrapingSymbol', filters)
            self.assert_in_and_not_empty('expiry', filters)
            self.assert_in_and_not_empty('serviceName', filters)
            self.assert_in_and_not_empty('pair', filters)
            self.assert_in_and_not_empty('classification', filters)
            self.assert_in_and_not_empty('makerFee', payload)
            self.assert_in_and_not_empty('takerFee', payload)
            self.assert_in_and_not_empty('margin', payload)
            self.assert_in_and_not_empty('marginCcy', payload)

    def assert_in_and_not_empty(self, member, container):
        self.assertIn(member, container, f'Missing key: {member} in {container}')
        self.assertTrue(container[member], f'The value of {container}[{member}] is empty')
