from fastapi import APIRouter, Request, HTTPException
from app.database.connection import db
from app.config import logger
from typing import List

import secrets

from app.models import User, Token
from app.database.queries.auth_queries import getUserIdByCredentials, checkIfUsernameExists, createUser

router = APIRouter()

@router.post("/login")
async def generate_token(user: User) -> Token:

	# Verificar Login
	userId = await getUserIdByCredentials(user.username, user.password)

	if not(userId):
		raise HTTPException(status_code=400, detail="Incorrect username or password")

	# Gerando Token
	token = Token(token=secrets.token_hex(nbytes=16))
	status = 10 #0 = Inativo, #10 = Ativo
	validUntil = 0

	# Desativar todos os outros tokens do mesmo user
	query = '''
		UPDATE authentication SET "statusId" = 0 WHERE "userId" = $1
		'''
	val = [userId]
	await db.execute(query, val)

	# Ativar o token novo
	query = 'INSERT INTO "authentication" ("userId", "token", "statusId") VALUES ($1, $2, $3)'
	val = [userId, token.token, status]
	await db.execute(query, val)
	

	return token

@router.post("/new")
async def create_account(user: User):

	# Verificar se já existe!

	if await checkIfUsernameExists(user.username):
		raise HTTPException(status_code=409, detail="User with this login already exists")  # 409 Conflict

	await createUser(user.username, user.password)

