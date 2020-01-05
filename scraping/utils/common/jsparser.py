import js2py


class JSParser:
    """
    A parser that can be used to convert Javascript objects into python dicts.
    It can also execute any javascript code including ES6
    """
    def __init__(self, script):
        self.__context = js2py.EvalJs({})
        try:
            self.__context.execute(script)
            self.__context = self.__context.to_dict()
        except Exception as e:
            raise JSParserException('Error parsing JavaScript') from e

    def __getitem__(self, item):
        return self.__context[item]


class JSParserException(Exception):
    pass
