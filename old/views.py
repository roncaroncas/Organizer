
class Page:
	def __init__(self, title, actions={}):
	    self.title = title
	    self.actions = actions

	def __str__(self):
		s = f"Página: {self.title}\r\n"
		s += f"Ações: {self.actions}"

		return s

# ---------------------------------------------

#Funções de Ações de Páginas
def changePageAction(st, page):
	if page in pages:
		st.currentPage = page
	else:
		print("ERROR 404")


	return st

def newUserAction(st):
	
	while True:
		ans = input ("Qual o nome do usuário a ser criado?")
		Profile(ans)

		if not ans in globals()["users"].keys():
			print("usuário criado com sucesso!")
			return

		else:
			print("Já existe usuário com esse nome!")

	return st
		 

def loginAction(st, userId):
	st.currentUserId = userId

	return st
	

def logoutAction(st):
	globals()["st.currentUserId"] = None

	return st

def addFriendAction(st, friendId):
	currentUserId.addFriendById(friendId)

	return st

def removeFriendAction(st, friendId):

	return st
	
def addTaskAction(st, name, startTime, endTime, peopleId=[]):
	
	return st

def removeTaskAction(st, Taskid):
	
	return st

# ---------------------------------------------

views = {}

views['Login'] = Page("Login", actions={
			"changePage":	changePageAction,
			"newUser": 		newUserAction,
			"login": 		loginAction,
			"logout": 		logoutAction,
		})

views['Friends'] =Page("Friends", actions={
			"changePage":	changePageAction,
			"addFriend": 	addFriendAction,
			"removeFriend": removeFriendAction,
		})

views['Calendar'] =Page("Calendar", actions={
			"changePage":	changePageAction,
			"addTask": 		addTaskAction,
			"removeTask": 	removeTaskAction,
		})

# ---------------------------------------------


