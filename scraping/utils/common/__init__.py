import os
import re


def get_base_path():
    """
    :return: base directory of scraping sub-repo
    """
    return os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def sanitize(_str, pattern_re=r'\s+'):
    """ Shorthand for sanitizing strings, removing unicode whitespace and normalizing end result"""

    return re.sub(pattern_re, ' ', _str).strip()
