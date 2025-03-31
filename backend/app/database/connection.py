import sqlite3

class DataBase:
	def __init__(self):
		self.connection = sqlite3.connect("app\\database\\orgdb.db")
		self.cursor = self.connection.cursor()

db = DataBase()
