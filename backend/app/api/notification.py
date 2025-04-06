from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

# from app.models import User, Token
from app.models import Notification

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.notification_queries import getAllNotificationsByUserId, updateStatusByUserTempoId


router = APIRouter()

@router.get("/getAll")
async def get_all_notifications(request: Request) -> List:

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # Invited Tasks:
    rows = await getAllNotificationsByUserId(userId)

    return [Notification(**dict(row)) for row in rows]
    

@router.put("/updateStatus")
async def update_notification_status(body: dict, request: Request):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # Invited Tasks:
    await updateStatusByUserTempoId(userId, body['tempoId'], body['newStatusId'])
   
    return True