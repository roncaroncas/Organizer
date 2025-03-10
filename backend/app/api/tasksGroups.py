from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import GroupTask

router = APIRouter()

@router.get("/myTaskGroups" , tags=["tasksGroups"])
async def my_tasks_groups(request: Request):

    #USER ID
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

    sql = (f"SELECT tg.id, tg.name, tg.parentId "
        f"FROM taskGroups tg "
        f"INNER JOIN userGroupTask ugt "
        f"ON tg.id = ugt.taskGroupId "
        f"INNER JOIN users u "
        f"ON u.id = ugt.userId "
        f"WHERE u.id = ?")

    val = [userId]

    rows = db.cursor.execute(sql, val).fetchall()

    # logger.debug(rows)

    groupTasks = []

    for r in rows:
        logger.debug(r)
        groupTasks.append(GroupTask(id=r[0], name=r[1], parentId=r[2]))

    logger.debug(groupTasks)

    return (groupTasks)

@router.post("/addTaskGroup" , tags=["tasksGroups"])
async def add_task_group(request: Request, groupTask: GroupTask) -> (GroupTask):

    logger.debug(groupTask)

    #USER ID
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

    sql = (f"INSERT INTO taskGroups "
        f"(name, parentId) "
        f"VALUES (?, ?) " 
        f"RETURNING id")

    val = [groupTask.name, groupTask.parentId]

    logger.debug(sql) 


    taskGroupId = db.cursor.execute(sql, val).fetchone()[0]
    db.connection.commit()

    groupTask.id = taskGroupId


    sql = (f"INSERT INTO userGroupTask "
        f"(userId, taskGroupId) "
        f"VALUES (?, ?) ")

    val = [userId, taskGroupId]

    db.cursor.execute(sql, val)
    db.connection.commit()


    return groupTask

@router.put("/updateTaskGroup" , tags=["tasksGroups"])
async def update_task_group(request: Request, groupTask: GroupTask) -> (GroupTask):

    #USER ID
    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    row = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchone()
    
    if row == None:
        raise HTTPException(status_code=401, detail="Not logged in")

    # Invited Tasks:
    sql = (f"UPDATE taskGroups "
        f"SET name = ?, parentId = ?  "
        f"WHERE id = ?"
        )

    val = [groupTask.name, groupTask.parentId, groupTask.id]


    db.cursor.execute(sql, val)
    db.connection.commit()

    return groupTask

@router.delete("/deleteTaskGroup" , tags=["tasksGroups"])
async def update_task_group(body: dict, request: Request) -> (bool):

    #USER ID
    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    row = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchone()
    
    if row == None:
        raise HTTPException(status_code=401, detail="Not logged in")

    sql = (f"DELETE FROM taskGroups "
        f"WHERE id = ? "
        )

    val = [body["id"]]


    db.cursor.execute(sql, val)
    db.connection.commit()

    return True
