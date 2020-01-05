from scraping import logger
from scraping.crawlers.cmc.fetcher import CMCFetcher
from scraping.configs import configs_adapter
from scraping.configs.config_keys import broker_config_keys
from scraping.utils.common.constants import LogLevels


def scrape_live_data():
    config = configs_adapter.load_config('cmc', broker_config_keys)
    fetcher = CMCFetcher(config)

    if not fetcher.login():
        exit()

    fetcher.open_crypto_library()

    try:
        fetcher.publish_live_prices()
    except BaseException:
        logger.log('The cmc live prices crawler has failed', LogLevels.WARNING)
        fetcher.clean_dashboard()
        exit(1)


def scrape_quasi_live_data():
    config = configs_adapter.load_config('cmc', broker_config_keys)
    fetcher = CMCFetcher(config)

    if not fetcher.login():
        exit()

    fetcher.close_menus()
    fetcher.open_crypto_library()
    fetcher.persist_quasi_live_data()
    fetcher.clean_dashboard()
