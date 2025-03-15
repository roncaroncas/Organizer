from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

# from app.models import User, Token


router = APIRouter()

@router.get("/myNotifications")
async def get_notifications(request: Request):

    #USER ID
    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    # Invited Tasks:

    sql = (f"SELECT ut.id, t.taskName "
        f"FROM tasks t "
        f"INNER JOIN usersTasks ut ON t.id = ut.taskId "
        f"WHERE ut.userId = ? and ut.statusId = ?"
        )

    val = [userId, 0]   #ut.taskStatus = 0 -> "Invited"

    results = db.cursor.execute(sql, val).fetchall()

    return results

@router.put("/updateNotificationStatus")
async def update_notification_status(body: dict, request: Request):

    #USER ID
    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    # Invited Tasks:
    sql = (f"UPDATE usersTasks "
        f"SET statusId = ? "
        # f"FROM usersTasks  "
        # f"INNER JOIN users u on ut.userId = u.id " 
        f"WHERE usersTasks.id = ?"
        # f"WHERE ut.id = ? and u.id = ?"
        )

    logger.debug(sql)

    # val = [body['idUserTask'], userId]   #ut.taskStatus = 0 -> "Invited"
    val = [body['newStatus'], body['idUserTask']]  #ut.taskStatus = 0 -> "Invited"

    logger.debug(val)


    db.cursor.execute(sql, val)
    db.connection.commit()

    return True