from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import User, Group

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.group_queries import getAllGroupsByUserId, getGroupByIdWithMembers, addGroup

router = APIRouter()


@router.get("/getAll")
async def get_all_groups(request: Request) -> (List[Group]):

	# Check if logged in
	userId = await getUserIdByToken(str(request.cookies.get("token")))
	if not(userId):
		raise HTTPException(status_code=401, detail="Not logged in")

	# Get Groups
	rows = await getAllGroupsByUserId(userId)

	#Convert to Pydantic model
	groups = []

	for r in rows:		
		groups.append(Group(
			id=r['id'],
			name=r['name'],
			description=r['description'],
			users=[]
		))


	return groups


@router.get("/get/{id}")
async def get_group(id: int, request: Request) -> (Group):

	# Check if logged in
	userId = await getUserIdByToken(str(request.cookies.get("token")))
	if not(userId):
		raise HTTPException(status_code=401, detail="Not logged in")

	# Get Group:
	rows = await getGroupByIdWithMembers(id)

	logger.debug(rows)
  
	members = []
	for r in rows:
		logger.debug(r)
		members.append(User(id=r['userId'], name=r['userName']))

	group = Group(
		id=rows[0]['groupId'],
		name=rows[0]['groupName'],
		description=rows[0]['description'],
		users=members
	)

	return group

@router.post("/add")
async def add_group(group: Group, request: Request) -> (Group):

	# Check if logged in
	userId = await getUserIdByToken(str(request.cookies.get("token")))
	if not(userId):
		raise HTTPException(status_code=401, detail="Not logged in")

	await addGroup(group.name, group.description, userId)


	return group

# @router.post("/inviteMember/{id}")
# async def get_group(id: int, user: User, request: Request) -> bool:

# 	query = (f"SELECT users.id " 
# 		f"FROM tokenAuth "
# 		f"INNER JOIN users "
# 		f"ON tokenAuth.userId = users.id "
# 		f"WHERE token = ?")

# 	row = db.cursor.execute(query, [str(request.cookies.get("token"))]).fetchone()
	
# 	if row == None:
# 		raise HTTPException(status_code=401, detail="Not logged in")
# 	else:
# 		userId = row[0]

# 	#CONECTANDO GRUPO AO USUARIO
# 	query = (f"INSERT INTO usersToFriendGroups "
# 		f"(userId, friendGroupId) "
# 		f"VALUES (?, ?) "
# 		)

# 	val = [user.id, id]

# 	logger.debug(val)

# 	db.cursor.execute(query, val)
# 	db.connection.commit()


# 	return True
