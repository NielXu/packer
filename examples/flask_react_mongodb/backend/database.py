import pymongo

host = "127.0.0.1"
port = 27017
timeout = 5000
client = pymongo.MongoClient(host=host, port=port, serverSelectionTimeoutMS=timeout)

def test():
    client.list_database_names()

