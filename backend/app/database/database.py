import sqlite3


class DB:
	def __init__(self):
		self.connection = sqlite3.connect('orgdb.db')
		self.cursor = self.connection.cursor()

	#def createTable(self, tableName):
	#	self.cursor.execute (f'CREATE TABLE {tableName} (id int primary key, name text)')

db = DB()
#db.createTable("testTable")
