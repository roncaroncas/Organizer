from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import SimpleUser

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.user_queries import getAllUsers

router = APIRouter()

@router.get("/getAll")
async def get_all_users(request: Request) -> List[SimpleUser]:

     # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # Get Data
    rows = await getAllUsers()

    logger.debug(rows)

    SimpleUsers = [SimpleUser(**dict(row)) for row in rows]

    logger.debug(SimpleUsers)

    return SimpleUsers