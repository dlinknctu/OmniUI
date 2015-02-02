import sys
sys.path.append('src')
import unittest
from core import Core 

class CoreTestCase(unittest.TestCase):
    def restHandler(self):
        return

    def test_registerRestApi(self):
        core = Core()
        core.registerRestApi("rest", restHandler)
        expected = restHandler
        result = core.restHandlers['rest']
        self.assertEquals(expected, result)

if __name__ == '__main__':
    unittest.main()