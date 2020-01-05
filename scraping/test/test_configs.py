import unittest

from scraping.configs.adapter import ConfigsAdapter
from scraping.configs.config_keys import app_config_keys, broker_config_keys
from .utils import load_broker_configs


class TestConfigs(unittest.TestCase):
    def setUp(self):
        self.adapter = ConfigsAdapter()

    def test_app_configs_loaded(self):
        """
        Tests whether all app_config_keys are populated or not
        """
        keys_loaded = []
        configs = self.adapter.load_config()
        for key in configs:
            if key in app_config_keys and configs[key] != '':
                keys_loaded.append(key)
        self.assertEqual(len(app_config_keys), len(keys_loaded))

    def test_cmc_configs_loaded(self):
        platform = 'cmc'
        configs = self.adapter.load_config(platform, broker_config_keys)
        broker_keys, keys_loaded = load_broker_configs(platform, configs)
        self.assertEqual(len(broker_keys), len(keys_loaded))

    def test_deribit_configs_loaded(self):
        platform = 'deribit'
        configs = self.adapter.load_config(platform, broker_config_keys)
        broker_keys, keys_loaded = load_broker_configs(platform, configs)
        self.assertEqual(len(broker_keys), len(keys_loaded))
