from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import Friend

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.friend_queries import (
	getAllFriendsByUserId,
	getFriendProfileByUserId,
	addFriend,
	deleteFriend,
	acceptFriend,
	)

router = APIRouter()

@router.get("/getAll")
async def my_friends(request: Request) -> List[Friend]:

	# Check if logged in
	userId = await getUserIdByToken(str(request.cookies.get("token")))
	if not(userId):
		raise HTTPException(status_code=401, detail="Not logged in")

	#Get all friends!   
	rows = await getAllFriendsByUserId(userId)

	logger.debug(rows)
   
	friends = []
	for r in rows:
		friends.append(
			Friend(
				friendId=r["userId2"],
				friendName=r["username"],
				statusNmbr=r["statusId"],
				status=r["statusText"]
			)
		)

	
	return (friends)

@router.post("/add")
async def add_friend(body: dict, request: Request) -> (bool):

	# Check if logged in
	userId = await getUserIdByToken(str(request.cookies.get("token")))
	if not(userId):
		raise HTTPException(status_code=401, detail="Not logged in")

	# Check if friend exists
	friendId = body['friendId']
	friend = await getFriendProfileByUserId(friendId)
	if not(friendId):
		raise HTTPException(status_code=404, detail="Friend not found")

	# Create friendship
	if userId < friendId:
		await addFriend(userId, friendId, 11) #statusId = 11: wait for user2 to accept
	else:
		await addFriend(friendId, userId, 10) #statusId = 10: wait for user1 to accept


	return True


@router.delete("/delete")
async def delete_friend(body: dict, request: Request) -> (bool):

	# Check if logged in
	userId = await getUserIdByToken(str(request.cookies.get("token")))
	if not(userId):
		raise HTTPException(status_code=401, detail="Not logged in")

	# Check if friend exists
	friendId = body['friendId']
	friend = await getFriendProfileByUserId(friendId)
	if not(friendId):
		raise HTTPException(status_code=404, detail="Friend not found")

	await deleteFriend(userId, friendId)


	return True

@router.put("/accept")
async def accept_friend(body: dict, request: Request) -> (bool):

	# Check if logged in
	userId = await getUserIdByToken(str(request.cookies.get("token")))
	if not(userId):
		raise HTTPException(status_code=401, detail="Not logged in")

	friendId = body["friendId"]

	await acceptFriend(userId, friendId)


	return True