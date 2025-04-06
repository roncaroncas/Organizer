from app.database.connection import db

async def getSelfProfileData(userId):

	query = ('''
		SELECT "user"."id", "user"."name", "user"."birthday" 
		FROM "user" 
		WHERE "user"."id" = $1
		''')

	val = [userId]

	return await db.fetchrow(query, val)

async def getOtherProfileData(userId):

	query = ('''
		SELECT "user"."id", "user"."name", "user"."birthday" 
		FROM "user" 
		WHERE "user"."id" = $1
		''')

	val = [userId]

	return await db.fetchrow(query, val)