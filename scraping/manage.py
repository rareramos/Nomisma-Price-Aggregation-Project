import cmd
from time import sleep
from shlex import split as shlex_split
from importlib import import_module
from argparse import ArgumentParser

from scraping import logger
from scraping.utils.common.mappings import crawler_methods_map
from scraping.symbol_maps import symbol_maps_loader


class ScrapingShell(cmd.Cmd):
    intro = "Welcome to the Price Aggregation's scraping shell. Type help or ? to list commands.\n"
    prompt = '(scraping) '
    crawler_path = 'scraping.crawlers.{}'

    def __init__(self):
        super(ScrapingShell, self).__init__()
        self.base_parser = ArgumentParser(add_help=False)
        self.base_parser.add_argument('--service_name', default=False)

    def do_crawl(self, raw_args):
        """
        Start a crawl to scrape instruments, quasi-live data or live data for a specific service.

        Required arguments:
        :argument: --service_name <crawler-name>
        :argument: --data <type-of-data-to-scrape> (options: live, quasi-live, instruments)

        Optional arguments:
        :argument: --loop (keep crawling)
        :argument: --delay <delay-between-crawls> (delay in seconds)

        e.g. crawl --service_name deribit --data quasi-live --loop --delay 3600
        """
        parser = ArgumentParser(parents=[self.base_parser], add_help=False)
        parser.add_argument('--data', type=str, choices=['live', 'quasi-live', 'instruments'])
        parser.add_argument('--loop', action='store_true')
        parser.add_argument('--delay', type=int)
        args = parser.parse_args(shlex_split(raw_args))

        if args.data == 'live' and (args.loop or args.delay):
            logger.log('Crawler for live data run continuously, so we don;t need to use --loop or --delay with it')

        if (args.loop and not args.delay) or (args.delay and not args.loop):
            logger.log('Wrong use of the optional args: loop and delay. Please write "help crawl" to find out more')

        try:
            crawler_module = import_module(self.crawler_path.format(args.service_name))
            crawler_method = getattr(crawler_module, crawler_methods_map[args.data])

            if not crawler_method:
                self.method_not_found()
                return

            crawler_method()

            if not args.loop:
                return

            while True:
                sleep(args.delay)
                getattr(crawler_module, crawler_methods_map[args.data], self.method_not_found)()

        except ModuleNotFoundError:
            logger.log('Please mention the correct service name (in lower format)')

    def do_import_symbols(self, raw_args):
        """
        Import symbols maps in CSV format into mongoDB

        Required Arguments:
        :argument: --service_name <service-name> (first letter capital)
        """
        args = self.base_parser.parse_args(shlex_split(raw_args))
        symbol_maps_loader.load_map_from_csv_into_db(args.service_name)

    def method_not_found(self):
        logger.log("Couldn't find any method for scraping the requested type of data for given service")

    def default(self, line):
        logger.log('Unrecognized format: please type help <command-name> to see the proper usage')

    def emptyline(self):
        pass

    def do_bye(self, raw_args):
        """ close scraping shell"""
        exit(print('Goodbye!'))


if __name__ == '__main__':
    ScrapingShell().cmdloop()
