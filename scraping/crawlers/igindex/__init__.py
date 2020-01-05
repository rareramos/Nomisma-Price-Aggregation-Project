from scraping.crawlers.igindex.fetcher import IGIndexFetcher
from scraping.configs import configs_adapter
from scraping.configs.config_keys import broker_config_keys


def scrape_instruments():
    config = configs_adapter.load_config('igindex', broker_config_keys)
    fetcher = IGIndexFetcher(config)

    if not fetcher.login():
        fetcher.close_browser()
    else:
        fetcher.open_platform()
        fetcher.load_available_contracts()
        fetcher.close_browser()
