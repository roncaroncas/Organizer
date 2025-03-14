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
    sql = (f"SELECT fg.id, fg.name, fg.description, u.id, u.name "
        f"FROM friendGroup fg "
        f"INNER JOIN usersToFriendGroups utfg ON utfg.friendGroupId = fg.id "
        f"INNER JOIN users u ON utfg.userId = u.id "
        f"WHERE fg.id = ?"
        )

    val = [id] 

    rows = db.cursor.execute(sql, val).fetchall()

    members = []

    for r in rows:
        logger.debug(r)
        members.append(User(id=r[3], name=r[4]))


    group = Group(
        id=rows[0][0],
        name=rows[0][1],
        description=rows[0][2],
        users=members
    )


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


@router.post("/addNew")
async def get_group(group: Group, request: Request) -> (Group):

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

    #CRIANDO NEW GROUP
    sql = (f"INSERT INTO friendGroup "
        f"(name, description) "
        f"VALUES (?, ?) "
        f"RETURNING id")

    val = [group.name, group.description] 

    groupId = db.cursor.execute(sql, val).fetchone()[0]
    db.connection.commit()

    #CONECTANDO GRUPO AO USUARIO
    sql = (f"INSERT INTO usersToFriendGroups "
        f"(userId, friendGroupId) "
        f"VALUES (?, ?) "
        )

    val = [userId, groupId]

    db.cursor.execute(sql, val)
    db.connection.commit()


    return group

@router.post("/inviteMember/{id}")
async def get_group(id: int, user: User, request: Request) -> bool:

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

    #CONECTANDO GRUPO AO USUARIO
    sql = (f"INSERT INTO usersToFriendGroups "
        f"(userId, friendGroupId) "
        f"VALUES (?, ?) "
        )

    val = [user.id, id]

    logger.debug(val)

    db.cursor.execute(sql, val)
    db.connection.commit()


    return True
