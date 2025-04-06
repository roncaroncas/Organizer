from app.database.connection import db

async def getAllPosts():

	query = '''
		SELECT p."id", p."authorId", u."name", p."groupId", p."text", p."timestamp"
		FROM "post" p
		LEFT JOIN "user" u ON u."id" = p."authorId"
		ORDER BY p."timestamp" DESC
		'''

	val = []

	rows = await db.fetch(query, val)

	return rows


async def addNewPost(userId, text):

	query = ('''
		INSERT INTO "post" 
		("authorId", "text") 
		VALUES ($1, $2) 
		''')

	val = [userId, text]

	await db.execute(query, val)


async def deletePost(postId):

	query = ('''
		DELETE FROM "post" 
		WHERE "id" = $1 
		''')

	val = [postId]

	await db.execute(query, val)
