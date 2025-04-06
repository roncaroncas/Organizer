from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import Profile

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.profile_queries import getSelfProfileData, getOtherProfileData

router = APIRouter()

@router.get("/")
async def my_profile(request: Request):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # Get Data
    row = await getSelfProfileData(userId)

    return Profile(**dict(row))

@router.get("/{id}")
async def get_profile_by_id(id: int, request: Request) -> Profile:

     # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # Get Data
    row = await getOtherProfileData(userId)

    return Profile(**dict(row))