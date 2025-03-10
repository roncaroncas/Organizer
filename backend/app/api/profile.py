from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import User, Token


router = APIRouter()


@router.get("/profile", tags=["profile"])
async def my_profile(request: Request):

    sql = (f"SELECT users.id, users.name, users.dateOfBirth " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userData = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0]

    # logger.debug(userData)
    
    return userData

@router.get("/profile/{id}", tags=["profile"])
async def get_profile_by_id(id: int, request: Request):

    # logger.debug(id)

    sql = (f"SELECT users.id, users.name, users.dateOfBirth " 
        f"FROM users "
        f"WHERE users.id = ?")

    userData = db.cursor.execute(sql, [id]).fetchall()[0]

    # logger.debug(userData)
    
    return userData