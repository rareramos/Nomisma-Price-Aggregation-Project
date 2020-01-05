from scraping.crawlers.bitmex.fetcher import BitmexFetcher
from scraping.configs import configs_adapter


def scrape_instruments():
    config = configs_adapter.load_config('bitmex', [])
    fetcher = BitmexFetcher(config)
    fetcher.open_live_trading()
    fetcher.load_available_contracts()
    fetcher.close_browser()
