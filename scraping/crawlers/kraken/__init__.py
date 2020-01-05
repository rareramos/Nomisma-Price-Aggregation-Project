from scraping.crawlers.kraken.fetcher import KrakenFetcher
from scraping.configs import configs_adapter


def scrape_quasi_live_data():
    config = configs_adapter.load_config('kraken', [])
    crawler = KrakenFetcher(config)

    crawler.load_contracts()
    crawler.get_contract_specs('Futures')
    response = crawler.get_contract_specs('Perpetual')
    crawler.get_trading_fees(response)
    crawler.persist_quasi_live_data()
