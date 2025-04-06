from app.database.connection import db

async def getAllFriendsByUserId (userId):

	query = ('''
		SELECT uus."userId2", u."username", l."id" AS "statusId", l."text" AS "statusText" 
		FROM "user_user_symmetrical" uus 
		LEFT JOIN "user" u ON u."id" = uus."userId2"
		LEFT JOIN "lookup" AS l ON l."id" = uus."statusId" 
		WHERE uus."userId1" = $1
		''')

	val = [userId]

	return await db.fetch(query, val)

async def getFriendProfileByUserId (userId):

	query = ('''
		SELECT 1 
		FROM "user" WHERE "id" = $1
		''')
	val = [userId]

	row = await db.fetchrow(query, val)

async def addFriend (userId, friendId, statusId):

	query = ('''
		INSERT INTO "user_user" 
		("userId1", "userId2", "statusId") 
		VALUES ($1, $2, $3) 
		''')

	val = [userId, friendId, statusId]

	await db.execute(query, val)

async def deleteFriend (userId, friendId):

	query = ('''
		DELETE FROM "user_user" 
		WHERE ("userId1" = $1 AND "userId2" = $2) 
		''')

	id1, id2 = sorted([userId, friendId])
	val = [id1, id2]

	await db.execute(query, val)

async def acceptFriend (userId, friendId):

	query = ('''
		UPDATE "user_user" 
		SET "statusId" = $3
		WHERE "userId1" = $1 and "userId2" = $2
		''')

	id1, id2 = sorted([userId, friendId])
	val = [id1, id2, 12] #status 12 = accepted

	await db.execute(query, val)


