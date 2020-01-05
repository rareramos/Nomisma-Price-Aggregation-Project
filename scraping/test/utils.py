from scraping.configs.config_keys import broker_config_keys


def load_broker_configs(platform, loaded_configs):
    """
    Loads a given broker configuration from f-strings
    """
    keys_loaded, broker_keys = [], []
    for conf in broker_config_keys:
        broker_keys.append(conf.format(platform.upper(), 'r'))

    for key in loaded_configs:
        if key in broker_keys and loaded_configs[key] != '':
            keys_loaded.append(key)

    return broker_keys, keys_loaded
