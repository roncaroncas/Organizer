from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import User, Group


router = APIRouter()

@router.get("/get/{id}")
async def get_group(id: int, request: Request) -> (Group):

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    row = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchone()
    
    if row == None:
        raise HTTPException(status_code=401, detail="Not logged in")
    else:
        userId = row[0]


    # Invited Tasks:
    sql = (f"SELECT fg.id, fg.name, fg.description "
        f"FROM friendGroup fg "
        f"INNER JOIN usersToFriendGroups utfg ON utfg.friendGroupId = fg.id "
        f"INNER JOIN users u ON utfg.userId = u.id "
        f"WHERE u.id = ? and fg.id = ?"
        )

    logger.debug(sql)

    val = [userId, id] 

    row = db.cursor.execute(sql, val).fetchone()

    logger.debug(row)


    group = Group(
        id=row[0],
        name=row[1],
        description=row[2],
        users=[]
    )

    logger.debug(group)

    return group

@router.get("/getAll")
async def get_all_groups(request: Request) -> (List[Group]):

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    row = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchone()
    
    if row == None:
        raise HTTPException(status_code=401, detail="Not logged in")
    else:
        userId = row[0]


    # Invited Tasks:
    sql = (f"SELECT fg.id, fg.name, fg.description "
        f"FROM friendGroup fg "
        f"INNER JOIN usersToFriendGroups utfg ON utfg.friendGroupId = fg.id "
        f"INNER JOIN users u ON utfg.userId = u.id "
        f"WHERE u.id = ?"
        )

    logger.debug(sql)

    val = [userId] 

    rows = db.cursor.execute(sql, val).fetchall()

    logger.debug(rows)


    groups = []

    for r in rows:
        
        groups.append(Group(
            id=r[0],
            name=r[1],
            description=r[2],
            users=[]
        ))

    return groups

