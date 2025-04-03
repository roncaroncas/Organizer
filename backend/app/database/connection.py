import asyncpg

import os
from dotenv import load_dotenv

load_dotenv()

class DataBase:

	async def initialize(self):
		self._pool = await asyncpg.create_pool(
			min_size=1,
			max_size=10,
			host=os.getenv('DB_HOST'),
			database=os.getenv('DB_NAME'),
			user=os.getenv('DB_USER'),
			password=os.getenv('DB_PASSWORD'),
			port=os.getenv('DB_PORT')
		)

	async def execute(self, query, values=[]):
		values = values or []
		async with self._pool.acquire() as conn:
			return await conn.execute(query, *values)

	async def fetch(self, query, values=[]):
		values = values or []
		async with self._pool.acquire() as conn:
			return await conn.fetch(query, *values)

	async def fetchrow(self, query, values=[]):
		values = values or []
		async with self._pool.acquire() as conn:
			return await conn.fetchrow(query, *values)


db = DataBase()
