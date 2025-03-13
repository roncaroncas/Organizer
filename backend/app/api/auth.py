from fastapi import APIRouter, Request, HTTPException
from app.database.connection import db
from app.config import logger
from typing import List

import secrets

from app.models import User, Token

router = APIRouter()

@router.post("/login")
async def generate_token(user: User) -> (Token):

    # 2) Se existe, criar um SESSION_ID no DB e retorna-lo como token <----- falta essa parte!!

    sql = (f"SELECT id "
        f"FROM users "
        f" WHERE (username = ?) "
        f" AND (password = ?) "
        )

    val = [user.username, user.password]

    row = db.cursor.execute(sql, val).fetchall()

    if len(row) != 1:
        raise HTTPException(status_code=400, detail="Incorrect username or password")


    #id = id (auto increment)
    userId = row[0][0]

    token = Token(token=secrets.token_hex(nbytes=16))

    status = 10 #0 = Inativo, #10 = Ativo
    validUntil = 0

    #Desativar todos os outros tokens
    db.cursor.execute("UPDATE tokenAuth SET status = 0 WHERE userId = ?", [userId])

    #Ativar o token novo
    db.cursor.execute("INSERT INTO tokenAuth (userId, token, status, validUntil) VALUES (?, ?, ?, ?)",
        [userId, token.token, status, validUntil])
    db.connection.commit()

    logger.debug("salvei o token em tokenAuth!")

    return token