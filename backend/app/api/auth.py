from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import User, Token


router = APIRouter()

@router.post("/login", tags=["login"])
async def generate_token(user: User, response: Response) -> Token:

    # 2) Se existe, criar um SESSION_ID no DB e retorna-lo como token <----- falta essa parte!!

    query = db.cursor.execute("SELECT id FROM users where (username == ?) AND (password == ?)", [user.username, user.password]).fetchall()

    if len(query) == 1:

        #id = id (auto increment)
        userId = query[0][0]

        token = secrets.token_hex(nbytes=16)

        status = 10 #0 = Inativo, #10 = Ativo
        validUntil = 0

        #Desativar todos os outros tokens
        db.cursor.execute("UPDATE tokenAuth SET status = 0 WHERE userId = ?", [userId])

        #Ativar o token novo
        db.cursor.execute("INSERT INTO tokenAuth (userId, token, status, validUntil) VALUES (?, ?, ?, ?)",
            (userId, token, status, validUntil))
        db.connection.commit()

        logger.debug("salvei o token em tokenAuth!")

        return {"token": token}

    else:
        raise HTTPException(status_code=400, detail="Incorrect username or password")