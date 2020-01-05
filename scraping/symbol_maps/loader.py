from csv import DictReader

from scraping import logger
from scraping.configs import app_config
from scraping.utils.common.database import Database
from scraping.utils.common import get_base_path


class SymbolMapsLoader:
    """ Provides a mechanism to load and fetch symbol maps into/from mongoDB"""

    maps_dir = get_base_path() + '/symbol_maps'

    def __init__(self):
        self.db = Database()
        self.collection = app_config['PRICE_AGG_DB_SYMBOL_MAPS_COLLECTION']
        logger.log('SymbolMapsLoader is initiated')

    def load_map_from_csv_into_db(self, service_name):
        """
        This method is used to load symbols maps in the format of CSV files into mongoDB
        :param service_name: symbols are loaded for this service name e.g., Deribit, Kraken etc (first letter capital)
        """
        logger.log(f'Loading symbol map for {service_name}')

        with open(f'{self.maps_dir}/{service_name}/map.csv') as symbol_map_file:
            symbols_map = DictReader(symbol_map_file)

            for contract in symbols_map:
                filters = {'symbol': contract['symbol'], 'serviceName': service_name}
                payload = {
                    'nomismaSymbol': contract['nomismaSymbol'],
                    'pair': contract['pair'],
                    'classification': contract['classification'],
                    'expiry': contract['expiry'],
                }
                self.db.persist_data(filters, payload, self.collection)

        logger.log(f'Symbol Maps for {service_name} are successfully loaded into DB')

    def fetch_map_from_db(self, service_name):
        """
        This method fetches the symbol map from mongoDB.
        :param service_name: the name of service for which the symbol map is required
        :return: a dict with contract names as keys. each value is a dict with four fields
         nomismaSymbol, pair, classification, expiry
        """
        symbols_map = {}

        raw_map = self.db.fetch_data(self.collection, {'serviceName': service_name})
        for contract in raw_map:
            mapping = {
                'nomismaSymbol': contract['nomismaSymbol'],
                'pair': contract['pair'],
                'expiry': contract['expiry'],
                'classification': contract['classification'],
            }
            symbols_map.update({contract['symbol']: mapping.copy()})

        return symbols_map
