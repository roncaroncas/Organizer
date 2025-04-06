from app.database.connection import db

async def getAllGroupsByUserId(userId):

	query = ('''
		SELECT g."id", g."name", g."description" 
		FROM "group" g 
		INNER JOIN "user_group" ug 
			ON ug."groupId" = g."id" 
		INNER JOIN "user" u 
			ON ug."userId" = u."id" 
		WHERE u.id = $1
		''')
		
	val = [userId] 

	return await db.fetch(query, val)

async def getGroupByIdWithMembers(groupId):

	query = '''
		SELECT 
			g."id" AS "groupId",
			g."name" AS "groupName",
			g."description",
			u."id" AS "userId",
			u."name" AS "userName" 
		FROM "group" g 
		LEFT JOIN user_group ug 
			ON ug."groupId" = g."id"
		LEFT JOIN "user" u 
			ON ug."userId" = u."id" 
		WHERE g.id = $1
		'''
		
	val = [groupId] 

	return await db.fetch(query, val)

async def addGroup(groupName, groupDescription, userId):

	query = '''
		WITH new_group AS (
		    INSERT INTO "group" ("name", "description")
		    VALUES ($1, $2)
		    RETURNING "id"
		)
		INSERT INTO "user_group" ("userId", "groupId")
		SELECT $3, "id" FROM new_group
	'''

	val = [groupName, groupDescription, userId]

	await db.execute(query, val)
