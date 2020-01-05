from scraping.crawlers.okex.fetcher import OkexFetcher
from scraping.configs import configs_adapter


def scrape_quasi_live_data():
    config = configs_adapter.load_config('okex', [])
    fetcher = OkexFetcher(config)

    fetcher.load_perpetual_contracts()
    fetcher.load_future_contracts()
    fetcher.load_trading_fees()
    fetcher.persist_quasi_live_data()
    fetcher.persist_quasi_live_data('Futures')
    fetcher.close_browser()
