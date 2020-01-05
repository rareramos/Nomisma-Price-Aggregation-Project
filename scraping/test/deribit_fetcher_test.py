import unittest

from scraping.crawlers.deribit.fetcher import DeribitFetcher
from scraping.configs import configs_adapter
from scraping.configs.config_keys import broker_config_keys


class TestDeribitCrawler(unittest.TestCase):
    def setUp(self):
        config = configs_adapter.load_config('deribit', broker_config_keys)
        self.crawler = DeribitFetcher(config)

    def tearDown(self):
        self.crawler.close_browser()

    def test_crawler(self):
        self.assertTrue(self.crawler.login(), 'Login Failed')
        self.crawler.get_contracts()
        self.assertIsNot(self.crawler.available_contracts, {}, 'Available contracts not loaded')
        self.crawler.open_knowledge_base()
        self.crawler.open_fees_page()
        self.crawler.load_contract_fees()

        for currency in list(self.crawler.contract_fees.values()):
            for contracts, fees in currency.items():
                self.assertIn('makerFee', fees, f'makerFee not loaded for {contracts}')
                self.assertIn('takerFee', fees, f'takerFee not loaded for {contracts}')

        self.quasi_live_data_format_checking('Perpetual')
        self.quasi_live_data_format_checking('Futures')

    def quasi_live_data_format_checking(self, contract_type):
        for filters, payload in self.crawler.persist_quasi_live_data(contract_type=contract_type):
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
