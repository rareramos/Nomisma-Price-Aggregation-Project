from selenium.webdriver import Firefox, FirefoxProfile
from selenium.webdriver.firefox.options import Options


class WebDriver:
    """ Provides a web driver with desired preferences """

    def __init__(self, private_browsing=True, javascript_enabled=True, headless_browser=True):
        self.__options = Options()
        self.__options.headless = headless_browser
        self.__profile = FirefoxProfile()
        self.__options.preferences.update({"javascript.enabled": javascript_enabled})
        self.__profile.set_preference("browser.privatebrowsing.autostart", private_browsing)

    def get_driver(self):
        """
        :return: a firefox web driver with maximized window and implicit wait equal to 180
        """
        driver = Firefox(options=self.__options, firefox_profile=self.__profile)
        driver.maximize_window()
        driver.implicitly_wait(180)

        return driver
