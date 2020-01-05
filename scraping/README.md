# Nomisma Scraping

> Codebase for scraping live and/or quasi-live prices/data of various crypto currencies from different brokers

# Table of Contents

- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Easy Setup](#easy-setup)
  - [Dependencies](#dependencies)
  - [Instructions](#instructions)
- [Manual Setup](#manual-setup)
  - [Dependencies](#dependencies-1)
  - [Instructions](#instructions-1)
- [Run Crawlers](#run-crawlers)
- [Configurations](#configurations)
- [Database Management](#database-management)
- [Testing](#testing)

---

## Project Structure

`price-aggregator/scraping/` consists of following sections:

| Folder                   | Description                                                                                                      |
| ------------------------ | :--------------------------------------------------------------------------------------------------------------- |
| `crawlers`               | Every service/platform has a separate crawler folder which contains the main crawler class and driver program    |
| `configs`                | Contains config files for `scrapping/` application as well as third-party brokers such as `cmc`, `deribit` etc.. |
| `configs/adapter.py`     | Provides an interface that is used to load respective config files                                               |
| `configs/config_keys.py` | Lists down all config keys required to setup the project - includes both app-config keys and crawler-config keys |
| `utils`                  | Common and Broker-specific utility functions + constants are stored in this directory                            |
| `utils/database.py`      | Provides a class Database which serves as an interface for database connection and update queries                |
| `utils/mappings.py`      | Contains Mappings of target crypto(s) to be scrapped from the broker platform                                    |

## Development Setup

### Easy Setup

#### Dependencies

- Docker

#### Instructions

- Once Docker installed, proceed to: `cd scraping/`
- Build docker image: `docker build -t scraping .` (notice `.` specifices `Dockerfile` inside `scraping/`)
- Run container for `scraping` image: `docker run --memory 1024mb --shm-size 2g -it --network host scraping /bin/sh`
  (will run container with same network as the host machine, 1GB allocated memory, 2GB shared memory & provide an `sh` terminal)

### Manual Setup

#### Dependencies

- Python 3.6.8
- Firefox 57+
- Selenium 3.141.0
- GeckoDriver 0.22+

#### Instructions

- Install the mentioned version of `GeckoDriver` on your system. (This is the driver that selenium will use to open firefox browser)
  - Go to the GeckoDriver releases page
  - Find the latest version of the driver for your platform and download it
  - For example: `wget https://github.com/mozilla/geckodriver/releases/download/v0.24.0/geckodriver-v0.24.0-linux64.tar.gz`
  - Extract the file with: `tar -xvzf geckodriver*`
  - Make it executable: `chmod +x geckodriver`
  - Add the driver to your PATH so other tools can find it: `export PATH=$PATH:/path-to-extracted-file/.`
- create a virtual environment with python 3.6 and activate it:
  - `sudo pip3 install virtualenv`
  - `python -m virtualenv --python=python3.6 nomisma-scraping-env`
  - `source nomisma-scraping-env/bin/activate`
- Go to the sub-repo of scraping and install requirements
  - `cd scraping/`
  - `pip install -r requirements.txt`

## Run Crawlers

- crawlers can be run via the scraping shell. To open scraping shell execute this command:

  `python3 manage.py`

  After logging into the shell type help crawl or see the instructions below:

- Start crawler for live prices:

  `crawl --service_name <service-name> --data <data-to-be-scraped>`

  Here the value of `<data-to-be-scraped>` can be any of the following:

  - live
  - quasi-live
  - instruments

  Example: `crawl --service_name cmc --data live`

- Optional arguments `--loop` and `--delay` can be used for `quasi-live` data to specify if the crawler
  is required to run continuously with the delay given in seconds.

      Example: `crawl --service_name bitmex --data instruments --loop --delay 3600`

## Configurations

- Configuration is based on config keys and each config key is namespaced as `PRICE_AGG_<CONFIG_KEY>`

- Every configuration file is stored as a YAML formatted config file. The configuration files are present in configs
  directory, apps config file contains Database URI, db-name, username etc.

- While the broker's config files contain the `base_url`, `credentials` (for local/dev env), `delays` etc. Broker
  config files can be placed in the dir: `configs/<market-name>/` (e.g. `configs/cmc/config.yml`).

- `configs/adapter.py`: Responsible to provide configuration for any broker (e.g. cmcmarkets, deribit)
  regardless of build environment. It gives first priority to the values present in .yaml config files. If not found, it
  loads the config values from environment variables (for production). If it does not find the value of any key in config
  and environment variables, then It sets the values to empty strings and logs a warning for it.

- To set environment variables, run the following commands in bash: `export <VARIABLE_NAME>="<VARIABLE_VALUE>"`

  - Example: `export PRICE_AGG_DB_NAME="nomisma-price-aggr"`

- All required config keys for app and broker(s) are listed at: `configs/config_keys.py`

## Database Management

- Database connections to MongoDB are handled via a singleton class `Database` defined under `utils/common/database.py`

* Database URI, db-name, collection-name, username and password can be configured via app configs

## Symbol Maps

- The contract symbols we get from scraping is mapped to the nomisma's internal symbols via a map. This map is kept as
  a CSV file in the service's respective directory at location `symbol_maps/<service-name>/`.

- A module `symbol_maps/loader.py` contains a class which exposes methods to load data from CSV files
  into mongoDB and fetch the map from mongo DB.

- The maps are loaded into the mongo DB via this command: `python3 symbol_maps/import_symbol_maps.py <service-name>`

  - Example: To load symbols for Deribit: `python3 symbol_maps/import_symbol_maps.py Deribit`
  - Example: To load symbols for IGIndex: `python3 symbol_maps/import_symbol_maps.py IG`

- These symbols are fetched from the DB whenever a fetcher is initiated. Fetcher keeps this map and uses it to map
  a given scrapingSymbol to nomismaSymbol, pair, expiry and classification.

- The symbols can also be loaded via scraping shell. Execute this command from `scraping/` directory to open shell `python3 manage.py`.

  Inside the shell execute this command to import symbols from csv into mongoDB:

  `import_symbols <service-name>` e.g. `import_symbols IG`

## Pylint

- pylint is integrated in our project to ensure the code follows good formatting and pep8 conformity.

- To run pylint on any package or module, activate the virtual environment and execute the following command:

  `pylint [module/package name]`

  e.g. `pylint scraping/crawlers/igindex/fetcher.py`

## Testing

- Unit tests for particular fetchers can be executed by this command:

  `python -m unittest scraping.test.<crawler-name>_fetcher_test`

  e.g., to run the unittest for bitmex fetcher: `python -m unittest scraping.test.bitmex_fetcher_test`

- Every new unittest should be added to the test suite located at `scraping/test/test_suite.py` so it can be run via the
  coverage command to generate correct and latest report.

- All unit tests can be executed by this command.

  `python3 scraping/test/__init__.py`

- This command will run all the tests present in test suite and it should be executed before finding code coverage report for the first time or if any unittest is
  added to the suite or modified to include more lines of code:

  `coverage run scraping/test/__init__.py`

* After running the tests, code coverage can be found out by executing this command:

  `coverage report --include '*scraping*'`

  (include flag is used to specify the file name pattern. Files matching this
  pattern will be included in the code coverage report.)
