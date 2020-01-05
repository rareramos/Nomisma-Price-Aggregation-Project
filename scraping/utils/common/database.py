from datetime import datetime

from pymongo import MongoClient

from scraping.configs import app_config


class Database:
    """
    Provides an interface to communicate with the mongoDB.
    """
    __instance = None

    def __init__(
        self,
        uri=app_config['PRICE_AGG_DB_URI'],
        name=app_config['PRICE_AGG_DB_NAME'],
        username=app_config['PRICE_AGG_DB_USERNAME'],
        password=app_config['PRICE_AGG_DB_PASSWORD'],
    ):
        if Database.__instance is None:
            self.client = MongoClient(uri, username=username, password=password, authSource=name)
            self.name = name
            Database.__instance = self

    def __new__(cls):
        """
        returns a new instance if there's no existing instance to ensure that
        the interface to DB remains singleton.
        """
        if Database.__instance is None:
            return super(Database, cls).__new__(cls)

        return Database.__instance

    def persist_data(
        self, filters, payload, collection=app_config["PRICE_AGG_DB_QUASI_LIVE_COLLECTION"], upsert=True, many=False
    ):
        """
        this method can be used to persist data into mongoDB
        :param filters: filters to use/select the documents from mongodb's collections
        :param payload: a dictionary with fields and values to be updated/created
        :param collection: collection of mongoDB to be updated
        :param upsert: update if already present otherwise insert
        :param many: update all records that match with conditions passed on in filters
        """
        payload.update({'lastUpdatedAt': datetime.utcnow().isoformat()})
        collection = self.get_collection(collection)
        if many:
            collection.update_many(filters, {'$set': payload}, upsert=upsert)
        else:
            collection.update_one(filters, {'$set': payload}, upsert=upsert)

    def fetch_data(self, collection, filters, many=True):
        """
        This method can be used to retrieve data from mongoDB
        :param collection: collection from where the data is to be fetched
        :param filters: criteria to select documents from mentioned collection
        :param many: retrieve all records that match with provided filters
        """
        collection = self.get_collection(collection)
        if many:
            return collection.find(filters)

        return collection.find_one(filters)

    def get_collection(self, collection):
        """
        :param collection: the required collection's name
        :return: the interface to specified collection
        """
        return self.client[self.name][collection]
