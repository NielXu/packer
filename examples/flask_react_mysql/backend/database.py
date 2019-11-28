import mysql.connector as connector

host="localhost"
port=3306
user="root"
password="password"
connection = connector.connect(host=host, port=port, user=user, password=password)
cursor = connection.cursor()

def test():
    databases = ("show databases")
    cursor.execute(databases)
    li=[]
    for (databases) in cursor:
       li.append(databases[0])

