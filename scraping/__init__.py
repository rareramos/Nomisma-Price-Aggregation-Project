import os

from scraping.utils.common.logger import Logger

enable_logging = os.environ.get('PRICE_AGG_RUN_ENV') != 'TEST'
logger = Logger(enable_logging=enable_logging)
