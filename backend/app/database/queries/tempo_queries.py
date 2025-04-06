from app.database.connection import db

# GET

async def getAllTemposByUserId(userId):

	query = ('''
		SELECT
			t."id",
			t."name",
			t."startTimestamp",
			t."endTimestamp",
			t."place",
			t."fullDay",
			t."description",
			l."text"
		FROM "tempo" AS t 
		LEFT JOIN "user_tempo" AS ut ON ut."tempoId" = t."id" 
		LEFT JOIN "user" AS u ON u."id" = ut."userId" 
		LEFT JOIN "lookup" AS l ON l."id" = ut."statusId" 
		WHERE u.id = $1
		''')

	val = [userId]

	rows = await db.fetch(query, val)

	return rows

async def getAllTemposWithParentByUserId(userId):

	query = ('''
		SELECT
			t."id",
			t."name",
			t."startTimestamp",
			t."endTimestamp",
			t."place", t."fullDay",
			t."description",
			l."text",
			tt."parentId" 
		FROM tempo AS t 
		LEFT JOIN "tempo_tempo" AS tt ON tt."childId" = t."id" 
		LEFT JOIN "user_tempo" AS ut ON ut."tempoId" = t."id" 
		LEFT JOIN "user" AS u ON u."id" = ut."userId"
		LEFT JOIN "lookup" AS l ON l."id" = ut."statusId" 
		WHERE u."id" = $1; 
		''')

	val = [userId]

	rows = await db.fetch(query, val)

	return rows

# CREATE

async def createNewTempo(name, startTime, endTime, place, fullDay, description):

	query = ('''
		INSERT INTO "tempo"
		("name", "startTimestamp", "endTimestamp", "place", "fullDay", "description") 
		VALUES ($1, $2, $3, $4, $5, $6) 
		RETURNING "id"
		''')

	val = [name, startTime, endTime, place, fullDay, description]

	tempoId = (await db.fetchrow(query, val))['id']

	return tempoId

async def connectTempoToUser(tempoId, userId):

	query = ('''
		INSERT INTO "user_tempo" 
		("userId", "tempoId", "statusId") 
		VALUES ($1, $2, $3
		''')

	val = [userId, tempoId, 0]

	await db.execute(query, val)

# UPDATE

async def updateTempo(name, startTime, endTime, place, fullDay, description, id):

	query = ('''
		UPDATE "tempo" 
		SET "name" = $1, "startTimestamp" = $2, "endTimestamp" = $3, "place" = $4, "fullDay" = $5, "description" = $6 
		WHERE id = $7
		''')

	val = [name, startTime, endTime, place, fullDay, description, id]

	await db.execute(query, val)
