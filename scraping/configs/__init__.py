from .adapter import ConfigsAdapter


configs_adapter = ConfigsAdapter()
app_config = configs_adapter.load_config()
