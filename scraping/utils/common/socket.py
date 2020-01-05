from socketio import Client as SocketClient
from scraping.configs import app_config


class WebSocket:
    """ Provides a socket connection to publish live data on pubsub"""
    __instance = None

    def __init__(self, address=app_config['PRICE_AGG_SOCKET_ADDRESS']):
        if WebSocket.__instance is None:
            self._socket = SocketClient()
            self._socket.connect(address)
            WebSocket.__instance = self

    def __new__(cls):
        if WebSocket.__instance is None:
            return super(WebSocket, cls).__new__(cls)

        return WebSocket.__instance

    def publish_data(self, payload, event='update'):
        """
        This method can be used to publish the data on opened socket connection
        :param payload: data to be published
        :param event: name of the event to be sent to pubsub
        :return:
        """
        self._socket.emit(event, payload)

    def get_connection(self):
        """
        :return: gives interface to the underlying socket connection
        """
        return self._socket
