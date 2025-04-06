from app.database.connection import db

async def getAllNotificationsByUserId (userId):

	query = ('''
		SELECT t."id", t."name", ut."statusId" 
		FROM "tempo" t 
		INNER JOIN "user_tempo" ut ON t."id" = ut."tempoId" 
		LEFT JOIN "lookup" AS l ON l."id" = ut."statusId" 
		WHERE ut."userId" = $1 and ut."statusId" = $2
		''')

	val = [userId, 0]   #ut.taskStatus = 0 -> 'Invited'

	rows = await db.fetch(query, val)

	return (rows)

async def updateStatusByUserTempoId(userId, tempoId, newStatusId):

	sql = ('''
		UPDATE "user_tempo"
		SET "statusId" = $3 
		WHERE "user_tempo"."userId" = $1 AND "user_tempo"."tempoId" = $2
		''')

	val = [userId, tempoId, newStatusId]

	await db.execute(sql, val)

	return
