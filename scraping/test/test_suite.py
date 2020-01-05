from unittest import TestSuite, TestLoader

from scraping.test.deribit_fetcher_test import TestDeribitCrawler
from scraping.test.kraken_fetcher_test import TestKrakenCrawler
from scraping.test.bitmex_fetcher_test import TestBitmexCrawler
from scraping.test.okex_fetcher_test import TestOkexCrawler
from scraping.test.igindex_fetcher_test import TestIGIndexCrawler
from scraping.test.test_configs import TestConfigs
from scraping.test.test_jsparser import TestJSParser
from scraping.test.test_web_driver import TestWebDriver

test_loader = TestLoader()


def get_crawlers_tests():
    test_suite = TestSuite()
    test_suite.addTests([
        test_loader.loadTestsFromTestCase(TestBitmexCrawler),
        test_loader.loadTestsFromTestCase(TestDeribitCrawler),
        test_loader.loadTestsFromTestCase(TestOkexCrawler),
        test_loader.loadTestsFromTestCase(TestIGIndexCrawler),
        test_loader.loadTestsFromTestCase(TestKrakenCrawler),
    ])
    return test_suite


def get_utils_tests():
    test_suite = TestSuite()
    test_suite.addTests([
        test_loader.loadTestsFromTestCase(TestWebDriver),
        test_loader.loadTestsFromTestCase(TestConfigs),
        test_loader.loadTestsFromTestCase(TestJSParser),
    ])
    return test_suite
