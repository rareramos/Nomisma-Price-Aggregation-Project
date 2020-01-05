import unittest

from scraping.utils.common.web_driver import WebDriver


class TestWebDriver(unittest.TestCase):
    def setUp(self):
        self.driver = WebDriver().get_driver()

    def tearDown(self):
        self.driver.quit()

    def test_driver_window_size(self):
        """
        Tests whether driver has the desired capabilities
        """
        window_size = self.driver.get_window_size()
        self.assertEqual(window_size['width'], 1920, "Window width doesn't equal the desired value")
        self.assertEqual(window_size['height'], 1080, "Window height doesn't equal the desired value")

    def test_driver_browsing_mode(self):
        self.assertEqual(self.driver.capabilities['moz:headless'], True, 'Browser is not in headless mode')
        private_browsing = self.driver.profile.default_preferences['browser.privatebrowsing.autostart']
        self.assertEqual(private_browsing, True, 'Private browsing is not enabled')
