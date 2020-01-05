from scraping.crawlers.deribit.fetcher import DeribitFetcher
from scraping.configs import configs_adapter
from scraping.configs.config_keys import broker_config_keys


def scrape_quasi_live_data():
    config = configs_adapter.load_config('deribit', broker_config_keys)
    crawler = DeribitFetcher(config)

    if not crawler.login():
        crawler.close_browser()
    else:
        crawler.get_contracts()
        crawler.open_knowledge_base()
        crawler.open_fees_page()
        crawler.load_contract_fees()
        crawler.persist_quasi_live_data('Perpetual')
        crawler.persist_quasi_live_data('Futures')
        crawler.close_browser()
