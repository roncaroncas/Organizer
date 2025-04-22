from app.database.connection import db

async def getAllUsers():

	query = ('''
		SELECT "user"."id", "user"."name"
		FROM "user"
		''')

	val = []

	return await db.fetch(query, val)

async def getFilteredUsers(search):

	query = ('''
		SELECT "user"."id", "user"."name"
		FROM "user"
		WHERE name LIKE $1
		 ORDER BY LENGTH("user"."name") ASC, "user"."name" ASC
        LIMIT 10
		''')

	val = [search+"%"]

	return await db.fetch(query, val)

async def getUserTempoByIds(userId, tempoId):

	query = ('''
		SELECT "user_tempo"."userId", "user_tempo"."tempoId", "user_tempo"."statusId"
		FROM "user_tempo"
		WHERE "user_tempo"."userId" = $1 AND "user_tempo"."tempoId" = $2
		'''
		)

	val = [userId, tempoId]

	return await db.fetchrow(query, val)

async def createUserTempo(userId, tempoId):

	query = ('''
		INSERT INTO "user_tempo"
		("userId", "tempoId", "statusId")
		VALUES
		($1, $2, 0)
		'''
		)

	val = [userId, tempoId]

	return await db.execute(query, val)

async def getUsersByTempoId(tempoId):

	query = ('''
		SELECT u."id", u."name" 
		FROM "user" u
		INNER JOIN "user_tempo" ut on u."id" = ut."userId"
		WHERE ut."tempoId" = $1
		'''
		)

	val = [tempoId]

	return await db.fetch(query, val)

async def deleteUserTempo(userId, tempoId):

	query = ('''
		DELETE FROM "user_tempo" ut
		WHERE ut."userId" = $1 AND ut."tempoId" = $2
		'''
		)

	val = [userId, tempoId]

	return await db.execute(query, val)






