from app.database.connection import db

async def getAllUsers():

	query = ('''
		SELECT "user"."id", "user"."name"
		FROM "user"
		''')

	val = []

	return await db.fetch(query, val)

async def getFilteredUsers(text):

	query = ('''
		SELECT "user"."id", "user"."name"
		FROM "user"
		WHERE name LIKE $1
		''')

	val = [text+"%"]

	return await db.fetch(query, val)

