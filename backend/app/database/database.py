import sqlite3


class DB:
	def __init__(self):
		self.connection = sqlite3.connect("C:\\Users\\NTB-VICTOR\\OneDrive - Leistung Com. e Serv. de Sist. Energia Ltda\\Documents\\Projetos\\Campo Minado Fifoncas\\Organizer\\backend\\app\\database\\orgdb.db")
		self.cursor = self.connection.cursor()

	#def createTable(self, tableName):
	#	self.cursor.execute (f'CREATE TABLE {tableName} (id int primary key, name text)')

db = DB()
#db.createTable("testTable")
