import os
from unittest import TextTestRunner

from scraping.test.test_suite import get_utils_tests, get_crawlers_tests

if __name__ == "__main__":
    os.environ['PRICE_AGG_RUN_ENV'] = 'TEST'
    test_runner = TextTestRunner(verbosity=2, failfast=True)
    tests_result = test_runner.run(get_utils_tests())

    if tests_result.wasSuccessful():
        test_runner.run(get_crawlers_tests())
