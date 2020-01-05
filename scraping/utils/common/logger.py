import logging

from .constants import LOGGING_FORMAT, LogLevels


class Logger:
    """ Provides a logger with the specified logging format"""
    def __init__(self, enable_logging=True, logging_format=LOGGING_FORMAT):
        logging.basicConfig(format=logging_format)
        self._logger = logging.getLogger('scraping-logger')
        self._logger.setLevel(logging.DEBUG)
        self.logging_enabled = enable_logging
        self._loggers = {
            LogLevels.INFO: self._logger.info,
            LogLevels.DEBUG: self._logger.debug,
            LogLevels.WARNING: self._logger.warning,
            LogLevels.ERROR: self._logger.error,
        }

    def log(self, message, log_level=LogLevels.INFO):
        """
        This method can be used to log messages in scraping sub-repo
        :param message: message to be logged
        :param log_level: specifies the log level e.g. warning, error, info etc
        """
        if self.logging_enabled:
            self._loggers.get(log_level, self._logger.info)(message)
