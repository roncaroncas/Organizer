
from app.database.connection import db


async def getUserIdByCredentials (username, password):

	query = 'SELECT * FROM "user" WHERE username = $1 AND password = $2'
	val = [username, password]

	row = await db.fetchrow(query, val)

	if not(row):
		return None
	else:
		return row['id']

async def checkIfUsernameExists (login):

	query = '''
		SELECT COUNT(1)
		FROM "user" u
		WHERE u."username" = $1
	'''

	val = [login]

	row = await db.fetchrow(query, val)
	return row['count'] > 0 if row else False


async def getUserIdByToken (token):

	query = ('''
		SELECT "user"."id" 
        FROM "authentication" 
        INNER JOIN "user" 
        ON "authentication"."userId" = "user"."id" 
        WHERE "token" = $1
        ''')

	val = [token]

	row = await db.fetchrow(query, val)

	if not(row):
		return None
	else:
		return row['id']


async def createUser (username, password):

	query = '''
				INSERT INTO "user"
					("username", "login", "password")
				VALUES ($1, $1, $2)
			'''

	val = [username, password]

	await db.execute(query, val)
