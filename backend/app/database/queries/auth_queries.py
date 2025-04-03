
from app.database.connection import db


async def getUserIdByCredentials (username, password):

	query = 'SELECT * FROM "user" WHERE username = $1 AND password = $2'
	val = [username, password]

	row = await db.fetchrow(query, val)

	if not(row):
		return None
	else:
		return row['id']

async def getUserIdByToken (token):

	query = ('SELECT "user"."id" \
        FROM "authentication" \
        INNER JOIN "user" \
        ON "authentication"."userId" = "user"."id" \
        WHERE "token" = $1')

	val = [token]

	row = await db.fetchrow(query, val)

	if not(row):
		return None
	else:
		return row['id']
