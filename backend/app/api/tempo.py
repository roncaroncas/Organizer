from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from datetime import datetime ### SOLUÇÃO TEMPORAAAAARIA!!! TEM QUE TIRAR SAPORRA!

from app.models import TempoRequest, TempoResponse

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.tempo_queries import (
    getAllTemposByUserId,
    getAllTemposWithParentByUserId,
    createNewTempo,
    connectTempoToUser,
    updateTempo)

router = APIRouter()

@router.get("/getAll")
async def my_tempos(request: Request) -> List[TempoResponse]:

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # GET ALL TEMPOS LINKED TO USER ID
    rows = await getAllTemposByUserId(userId)

    logger.debug(rows)

    # CONVERT TEMPOS TO MODEL
    tempos = []
    for r in rows:
        tempos.append(TempoResponse(
            id= r['id'], name= r['name'], startTimestamp= r['startTimestamp'].strftime('%Y-%m-%d %H:%M:%S'),
            endTimestamp= r['endTimestamp'].strftime('%Y-%m-%d %H:%M:%S'), place= r['place'], fullDay= r['fullDay'],
            description= r['description'], status=r['text']))

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
            id= r['id'], name= r['name'], startTimestamp= r['startTimestamp'].strftime('%Y-%m-%d %H:%M:%S'),
            endTimestamp= r['endTimestamp'].strftime('%Y-%m-%d %H:%M:%S'), place= r['place'], fullDay= r['fullDay'],
            description= r['description'], status=r['text'], parentId=r['parentId']))

    return (tempos)   

    
@router.post("/create")
async def create_tempo(tempo: TempoRequest, request: Request) -> (bool):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    #CRIANDO TEMPO
    timestamp_startTime = datetime.strptime(tempo.startTimestamp[:-1], "%Y-%m-%dT%H:%M:%S.%f") ###SOLUÇÃO PALIATIVA< PRECISA PASSAR TUDO PRA DATE!
    timestamp_endTime = datetime.strptime(tempo.endTimestamp[:-1], "%Y-%m-%dT%H:%M:%S.%f") ###SOLUÇÃO PALIATIVA< PRECISA PASSAR TUDO PRA DATE!

    tempoId = await createNewTempo(
        name = tempo.name,
        startTimestamp = timestamp_startTime,
        endTimestamp = timestamp_endTime,
        place = tempo.place,
        fullDay = tempo.fullDay,
        description = tempo.description,
        )

    # CONECTANDO O TEMPO AO USUARIO
    await connectTempoToUser(tempoId, userId)

    # RETURN
    return True

@router.put("/update")
async def update_tempo(tempo: TempoRequest, request: Request) -> (bool):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")


    #ATUALIZANDO TEMPO

    timestamp_startTime = datetime.strptime(tempo.startTimestamp[:-1], "%Y-%m-%dT%H:%M:%S.%f") ###SOLUÇÃO PALIATIVA< PRECISA PASSAR TUDO PRA DATE!
    timestamp_endTime = datetime.strptime(tempo.endTimestamp[:-1], "%Y-%m-%dT%H:%M:%S.%f") ###SOLUÇÃO PALIATIVA< PRECISA PASSAR TUDO PRA DATE!
    
    await updateTempo(
        name= tempo.name,
        startTimestamp= timestamp_startTime,
        endTime= timestamp_endTime,
        place= tempo.place,
        fullDay= tempo.fullDay,
        description= tempo.description,
        id= tempo.id,
        )

    #RETURN
    return True


# @router.get("/tempo/{tempoId}")
# async def get_tempo_by_id(tempoId: int, request: Request):

#     tempo = await getTempoById(tempoId)
    
#     return tempo


# -----------------     OLD CODE:

# @router.get("/tempo/{tempoId}/users")
# async def get_tempo_by_id_user(tempoId: int, request: Request):

#     query = (f"SELECT u.id, u.name " 
#         f"FROM usersTempos ut "
#         f"LEFT JOIN users u "
#         f"ON u.id = ut.userId "
#         f"WHERE ut.tempoId = ?")

#     tempoData = db.cursor.execute(query, [tempoId]).fetchall()
    
#     return tempoData

# @router.post("/tempo/{tempoId}/addUser/{userId}")
# async def add_user_to_tempo_by_id(tempoId: int, userId: int, request: Request):

#     # logger.debug(userId)

#     query = (f"INSERT INTO usersTempos "
#         f"(userId, tempoId) "
#         f"VALUES (?, ?)")

#     val = [userId, tempoId]
#     db.cursor.execute(query, val)
#     db.connection.commit()
    
#     return True