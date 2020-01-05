import os

from yaml import safe_load

from scraping import logger
from scraping.utils.common.logger import LogLevels
from scraping.utils.common import get_base_path
from .config_keys import app_config_keys


class ConfigsAdapter:
    """
    Generic Adapter which can be extended to fetch app config or broker configs
    """

    config_path_t = get_base_path() + '/configs/{}/config.yaml'

    def load_config(self, config_type='app', config_keys=app_config_keys):  # pylint: disable=W0102
        """
        This method is used to load config for any platform/service (e.g., bitmex, okex etc)
        :param config_type: the name of service name should be given here defaults to "app"
        :param config_keys: the list of keys that are mandatory in this config.
        :return: loaded configuration with mandatory keys
        """
        with open(self.config_path_t.format(config_type), 'r') as conf_file:
            loaded_configs = safe_load(conf_file)

        for key in config_keys:
            self._load_config_key(loaded_configs, key.format(config_type).upper())

        return loaded_configs

    def _load_config_key(self, config, key):
        """
        This method is used to make sure if a specific key is present in the config or not.
        Looks in the environment variables if not found in given config.
        :param config: config to be searched
        :param key: the key to be loaded
        """
        if key not in config or not config[key]:
            config[key] = os.environ.get(key, '')

            env = os.environ.get('PRICE_AGG_RUN_ENV', '')

            if not config[key] and env != 'TEST':
                logger.log(f'Could not load the required configuration key: {key}', LogLevels.WARNING)
