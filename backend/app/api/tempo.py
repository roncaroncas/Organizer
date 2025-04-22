from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import TempoRequest, TempoResponse, SimpleUser

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.tempo_queries import (
    getTempoById,
    getAllTemposByUserId,
    getAllTemposWithParentByUserId,
    createNewTempo,
    connectTempoToUser,
    updateTempo)
from app.database.queries.user_queries import (
    getUserTempoByIds, createUserTempo, deleteUserTempo, getUsersByTempoId)

router = APIRouter()

@router.get("/get/{tempoId}")
async def get_tempo_by_id(request: Request, tempoId: int) -> TempoResponse:

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # Check if USER have access to TEMPO ID
    # pffff kkkkk depois eu faço

    # GET ALL TEMPOS LINKED TO USER ID
    row = await getTempoById(userId, tempoId)

    logger.debug(row)
    
    if not(row):
        raise HTTPException(status_code=403, detail="Tempo doesnt exist or not authorized")

    # CONVERT TEMPO TO MODEL
    tempo = TempoResponse(
        id= row['id'], 
        name= row['name'], 
        startTimestamp= row['startTimestamp'].isoformat(),
        endTimestamp= row['endTimestamp'].isoformat(),
        place= row['place'], 
        fullDay= row['fullDay'],
        description= row['description'], 
        status=row['text']
    )

    return (tempo)

@router.get("/getAll")
async def my_tempos(request: Request) -> List[TempoResponse]:

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # GET ALL TEMPOS LINKED TO USER ID
    rows = await getAllTemposByUserId(userId)

    # logger.debug(rows)

    # CONVERT TEMPOS TO MODEL
    tempos = []
    for r in rows:
        tempos.append(TempoResponse(
            id= r['id'], 
            name= r['name'], 
            startTimestamp= r['startTimestamp'].isoformat(),
            endTimestamp= r['endTimestamp'].isoformat(),
            place= r['place'], 
            fullDay= r['fullDay'],
            description= r['description'], 
            status=r['text']
        ))

    return (tempos)

@router.get("/getAllWithParent")
async def my_tempos(request: Request) -> List[TempoResponse]:

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # GET ALL TEMPOS LINKED TO USER ID
    rows = await getAllTemposWithParentByUserId(userId)



    # CONVERT TEMPOS TO MODEL
    tempos = []
    for r in rows:
        tempos.append(TempoResponse(
            id= r['id'], 
            name= r['name'], 
            startTimestamp= r['startTimestamp'].isoformat(),
            endTimestamp= r['endTimestamp'].isoformat(),
            place= r['place'], 
            fullDay= r['fullDay'],
            description= r['description'], 
            status=r['text']
        ))

    return (tempos)   

    
@router.post("/create")
async def create_tempo(tempo: TempoRequest, request: Request) -> (bool):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

  
    tempoId = await createNewTempo(
        name = tempo.name,
        startTimestamp = tempo.startTimestamp,
        endTimestamp = tempo.endTimestamp,
        place = tempo.place,
        fullDay = tempo.fullDay,
        description = tempo.description,
        )

    # CONECTANDO O TEMPO AO USUARIO
    await connectTempoToUser(tempoId, userId)

    # RETURN
    return True

@router.put("/update/{tempoId}")
async def update_tempo(request: Request, tempoId: int, tempo: TempoRequest) -> (bool):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")
 
    logger.debug(tempo)

    await updateTempo(
        name= tempo.name,
        startTimestamp= tempo.startTimestamp,
        endTimestamp= tempo.endTimestamp,
        place= tempo.place,
        fullDay= tempo.fullDay,
        description= tempo.description,
        id= tempoId,
        )

    # Connect Users to Tempos!
    for u in tempo.users:
        # logger.debug ("u.id: " + str(u.id) + "  tempoId: " + str(tempoId))

        if (await getUserTempoByIds(u.id, tempoId)):
            #await updateUserTempo(tempoId, u.id)
            pass
        else:
            await createUserTempo(u.id, tempoId)

    # Deleting users!
    currentUsers = await getUsersByTempoId(tempoId)
    currentUsersId = {r['id'] for r in currentUsers}

    requestUsersId = {u.id for u in tempo.users}

    user_ids_to_remove = currentUsersId - requestUsersId

    # Step 4: Delete them
    for user_id in user_ids_to_remove:
        await deleteUserTempo(user_id, tempoId) 

    #RETURN
    return True

@router.get("/get/{tempoId}/users")
async def get_users_by_tempoId(request: Request, tempoId: int) -> (List[SimpleUser]):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    raw_users = await getUsersByTempoId(tempoId)

    # Convert to list of SimpleUser
    users = [SimpleUser(**user) for user in raw_users]

    logger.debug(users)
  
    #RETURN
    return users

