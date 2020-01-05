from argparse import ArgumentParser
from scraping.symbol_maps import symbol_maps_loader


def get_platform():
    parser = ArgumentParser()
    parser.add_argument('platform')
    args = parser.parse_args()
    return args.platform


if __name__ == "__main__":
    symbol_maps_loader.load_map_from_csv_into_db(get_platform())
