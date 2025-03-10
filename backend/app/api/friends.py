from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import Friend

router = APIRouter()

@router.get("/myFriends", tags=["friends"])
async def my_friends(request: Request) -> List[Friend]:

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    row = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchone()
    
    if row == None:
        raise HTTPException(status_code=401, detail="Not logged in")
    
    userId = row[0]

    sql = (f"SELECT f.userid2, u2.username, f.status, fs.value "
        f"FROM all_friendships f "
        f"LEFT JOIN users u1 ON u1.id = f.userid1 "
        f"LEFT JOIN users u2 ON u2.id = f.userid2 "
        f"JOIN friendshipStatus fs ON fs.id = f.status "
        f"WHERE u1.id = ?")

    rows = db.cursor.execute(sql, [userId]).fetchall()

    logger.debug(rows)

    friends = []
    for r in rows:
        friends.append(Friend(friendId=r[0], friendName=r[1], statusNmbr=r[2], status=r[3]))

    # logger.debug(friends)

    
    return (friends)

@router.post("/addFriend", tags=["friends"])
async def add_friend(body: dict, request: Request) -> (bool):

    friendId = body['friendId']

    #Check if friendId exists:
    sql = (f"SELECT 1 from users WHERE id = ?")
    row = db.cursor.execute(sql, [friendId]).fetchone()

    if row == None:
        raise HTTPException(status_code=404, detail="Friend not found")

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")
    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    sql = (f"INSERT INTO friendship "
        f"(userId1, userId2, status) "
        f"VALUES (?, ?, ?)")

    try:
        if userId < friendId:
            db.cursor.execute(sql, [userId, friendId, 2])
        elif userId > friendId:
            db.cursor.execute(sql, [friendId, userId, 1])
        db.connection.commit()
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail="Contraint Error")    

    return True


@router.delete("/deleteFriend", tags=["friends"])
async def delete_friend(body: dict, request: Request) -> (bool):


    sql = (f"SELECT 1 from users WHERE id = ?")
    row = db.cursor.execute(sql, [body["friendId"]]).fetchone()

    if row == None:
        raise HTTPException(status_code=404, detail="Friend not found")

    logger.debug("TO AVISANDO! VOU DESAMIGAR :(")

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")
    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    sql = (f"DELETE FROM friendship "
        f"WHERE (userId1 = ? AND userId2 = ?) "
        f"OR (userId2 = ? AND userId1 = ?) ")

    val = [userId, body["friendId"], userId, body["friendId"]]

    logger.debug(sql)
    logger.debug(val)


    try:
        db.cursor.execute(sql, val)
        db.connection.commit()

        logger.debug("desamiguei pra sempre")
    except sqlite3.IntegrityError as e:
        logger.debug("desamiguei errado hehehe")
        raise HTTPException(status_code=400, detail="Contraint Error")    

    return True

@router.put("/acceptFriend", tags=["friends"])
async def accept_friend(body: dict, request: Request) -> (bool):

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")
    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    friendId = body["friendId"]

    sql = (f"UPDATE friendship "
        f"SET status = ?"
        f"WHERE userId1 = ? and userId2 = ?")

    if userId < friendId:
        val = [3, userId, friendId]   #status 3 = accepted
    else:
        val = [3, friendId, userId]   #status 3 = accepted

    row = db.cursor.execute(sql, val).fetchone()[0]


    logger.debug(sql)
    logger.debug(val)

    try:
        db.cursor.execute(sql, val)
        db.connection.commit()

    except sqlite3.IntegrityError as e:
        logger.debug("aceitei amizade errado hehehe")
        raise HTTPException(status_code=400, detail="Contraint Error")    

    return True