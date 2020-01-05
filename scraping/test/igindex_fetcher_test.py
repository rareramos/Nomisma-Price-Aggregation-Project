import unittest

from scraping.crawlers.igindex.fetcher import IGIndexFetcher
from scraping.configs import configs_adapter
from scraping.configs.config_keys import broker_config_keys


class TestIGIndexCrawler(unittest.TestCase):
    def setUp(self):
        config = configs_adapter.load_config('igindex', broker_config_keys)
        self.crawler = IGIndexFetcher(config)

    def tearDown(self):
        self.crawler.close_browser()

    def test_crawler(self):
        self.assertTrue(self.crawler.login(), 'Login Failed')
        self.crawler.open_platform()

        for filters, payload in self.crawler.load_available_contracts():
            self.assert_in_and_not_empty('scrapingSymbol', filters)
            self.assert_in_and_not_empty('serviceName', filters)
            self.assert_in_and_not_empty('nomismaSymbol', payload)
            self.assert_in_and_not_empty('expiry', payload)
            self.assert_in_and_not_empty('pair', payload)
            self.assert_in_and_not_empty('classification', payload)

    def assert_in_and_not_empty(self, member, container):
        self.assertIn(member, container, f'Missing key: {member} in {container}')
        self.assertTrue(container[member], f'The value of {container}[{member}] is empty')
