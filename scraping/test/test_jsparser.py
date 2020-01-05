import unittest

from scraping.utils.common.jsparser import JSParser


class TestJSParser(unittest.TestCase):
    def setUp(self):
        self.script = '''
        var jsObject = {
            field1: "value",
            field2: 2,
            field3: 2.6,
            field4: false,
            field5: function(n){return (n > 10) ? false: true;},
            field6: [1,2,3,4,5],
        };
        '''
        self.parsed_js = JSParser(script=self.script)['jsObject']

    def test_js_parser(self):
        """
        Tests whether JSParser can parse javascript objects
        """
        self.assertEqual(self.parsed_js['field1'], 'value', "parser couldn't load the string value")
        self.assertEqual(self.parsed_js['field2'], 2, "parser couldn't load the integer value")
        self.assertEqual(self.parsed_js['field3'], 2.6, "parser couldn't load the float value")
        self.assertEqual(self.parsed_js['field4'], False, "parser couldn't load the boolean value")
        self.assertEqual(self.parsed_js['field5'](9), True, "parser couldn't execute the loaded function properly")
        self.assertEqual(self.parsed_js['field5'](11), False, "parser couldn't execute the loaded function properly")
        self.assertIn(1, self.parsed_js['field6'], "parser couldn't load the list properly")
        self.assertEqual(5, len(self.parsed_js['field6']), "parser couldn't load the list properly")
