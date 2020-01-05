import unittest

from scraping.crawlers.okex.fetcher import OkexFetcher
from scraping.configs import configs_adapter


class TestOkexCrawler(unittest.TestCase):
    def setUp(self):
        config = configs_adapter.load_config('okex', [])
        self.crawler = OkexFetcher(config)

    def tearDown(self):
        self.crawler.close_browser()

    def test_crawler(self):
        self.crawler.load_perpetual_contracts()
        self.assertTrue(self.crawler.available_contracts_map['Perpetual'], 'Perpetual Contracts not laoded properly!')
        self.crawler.load_future_contracts()
        self.assertTrue(self.crawler.available_contracts_map['Futures'], 'Future Contracts not laoded properly!')
        self.crawler.load_trading_fees()
        self.assertTrue(self.crawler.trading_fees['Perpetual'], 'Perpetual trading fees not laoded properly')
        self.assertTrue(self.crawler.trading_fees['Futures'], 'Futures trading fees not laoded properly')

        self.quasi_live_data_format_checking('Perpetual')
        self.quasi_live_data_format_checking('Futures')

    def quasi_live_data_format_checking(self, contract_type):
        for filters, payload in self.crawler.persist_quasi_live_data(contract_type):
            self.assert_in_and_not_empty('scrapingSymbol', filters)
            self.assert_in_and_not_empty('serviceName', filters)
            self.assert_in_and_not_empty('makerFee', payload)
            self.assert_in_and_not_empty('takerFee', payload)

    def assert_in_and_not_empty(self, member, container):
        self.assertIn(member, container, f'Missing key: {member} in {container}')
        self.assertTrue(container[member], f'The value of {container}[{member}] is empty')
