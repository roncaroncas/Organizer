import datetime
import inspect
from views import *

from fastapi import FastAPI

class DataBaseElements:
	def __init__(self):
		self.id = None

class Profile (DataBaseElements):
	#"users" corresponde a esse DB

	def __init__(self, name=""):
		super().__init__()
		self.name = name
		self.userFriends = []
		self.userTasks = []

	def __str__(self):
		s = f"User:    {self.name}\r\n"
		
		# s += "Friends: "
		# for f in self.friends:
		# 	s+= f"{users[f].name}({users[f].id})" + ", "
		# s = s[:-2] + "\r\n"
		
		# s += "Eventos: "
		# for e in self.tasks:
		# 	s+= f"{tasks[e].name}({tasks[e].id})" + ", "
		
		return s[:-2]

	def addFriendById(self, id):
		for u in users:
			if u.id == id:
				self.friends.append([friendConnection(self, friendUser)])
				return

		print("Não encontrado!")
		
	def loadFriendsId(self):
		self.userFriends = []
		for f in db.tables['friendship']:
			if db.tables['friendship'][f].userId1 == self.id:
				self.userFriends.append(db.tables['friendship'][f].userId2)
			if db.tables['friendship'][f].userId2 == self.id:
				self.userFriends.append(db.tables['friendship'][f].userId1)
			
	def loadEventsId(self):
		self.events = []
		for e in events:
			if self.id in e.people:
				self.events.append(e)

class FriendConnection (DataBaseElements):
	#"friendship" corresponde a esse DB

	def __init__(self, userId1, userId2):
		super().__init__()
		self.userId1 = userId1
		self.userId2 = userId2
		db.tables['users'][userId1].userFriends.append(userId2)
		db.tables['users'][userId2].userFriends.append(userId1)
		
class Task (DataBaseElements):
	def __init__(self, name, startTime="", endTime="", peopleId=[]):
		self.id = len(db.tables['tasks'])
		self.name = name
		self.startTime = startTime
		self.endTime = endTime
		self.peopleId = peopleId

		for p in peopleId:
			db.tables['users'][p].userTasks.append(self.id)
		
	def __str__(self):
		return f"{self.name}({self.id})"

class DataBase:

	def __init__(self, load=False):
		#tables = {pages, users, friendship, tasks}
		self.tables = {'users':{}, 'friendship':{}, 'tasks':{}}

	#DATABASE FUNCTIONS
	def create (self, tableName, obj):
		newId = len(self.tables[tableName])
		obj.id = newId
		self.tables[tableName][newId] = obj

	def read (self, tableName, objId):
		return (self.tables[tableName][objId])

	def update (self, tableName, objId, obj):
		self.tables[tableName][objId] = obj

	def delete (self, tableName, objId):
		del self.tables[tableName][objId]

	#DATABASE TOOLBOX
	def __str__(self):

		s = ""
		for t in self.tables:
			s += db.strTable(t) + "\r\n"

		return s

	def strTable(self, tableName):

		header = list(db.tables[tableName][0].__dict__.keys())

		s=(f"{tableName.upper()}".center(22*len(header), "-")+"-\r\n")
		
		#print header
		for h in header:
			s+=("| "+ h.ljust(20))
		s+=("|\r\n")

		s+=(22*"-"*len(header)+"-\r\n")
		
		for line in db.tables[tableName]:
			for param in header:
				s+=("| "+ f"{str((getattr(db.tables[tableName][line], str(param)))): <20}")
			s+=("|\r\n")
		
		s+=(22*"-"*len(header)+"-")

		return s

class State:

	def __init__(self):
		self.currentUserId = None
		self.currentUserName = None	
		self.currentPage = "Login"

	def seeView(self):

		print("...................................................")

		print(f"  CURRENT PAGE:   {self.currentUserName}")
		print(f"  CURRENT USER:   {self.currentUserName}({self.currentUserId})")

		print()
		print("  Actions")
		for a in views[self.currentPage].actions:
			print("   |_ " + a)

		print()

	def doAction(self):
		while True:
			act = input	("Qual ação você quer fazer?")
			if act == "":
				return
			elif act in views[self.currentPage].actions.keys():
				paramsList = (inspect.signature(views[self.currentPage].actions[act]).parameters.keys())
				print(paramsList)
				params = {value: None for value in (paramsList)}
				del params['st']

				print(f"Os parametros para essa página são: {params}")
				for p in params:
					val = input(f"Qual valor de {p}?")
					params[p] = val

				params['st'] = self
				print(params)
				self = views[self.currentPage].actions[act](**params)

				return
	

db = DataBase()

db.create('users', Profile("Adailton"))
db.create('users', Profile("Barbaro"))
db.create('users', Profile("Caetana"))
db.create('users', Profile("Dougles"))
db.create('users', Profile("Evandra"))

db.create('friendship', FriendConnection(1, 2)) #userId1, userId2
db.create('friendship', FriendConnection(1, 3))
db.create('friendship', FriendConnection(1, 4))
db.create('friendship', FriendConnection(4, 3))
db.create('friendship', FriendConnection(2, 4))
db.create('friendship', FriendConnection(3, 0))

db.create('tasks', 
	Task("Rolê 0",
	startTime 	= datetime.datetime(2025, 1, 15, 13, 30, 00),
	endTime 	= datetime.datetime(2025, 1, 15, 14, 00, 00),
	peopleId	= [0, 2, 4]
	))
db.create('tasks', 
	Task("Rolê 1",
	startTime 	= datetime.datetime(2025, 1, 16, 17, 00, 00),
	endTime 	= datetime.datetime(2025, 1, 16, 18, 00, 00),
	peopleId	= [0, 1, 3, 4]
	))

st = State()


app = FastAPI()

print(db)

st.seeView()
st.doAction()
