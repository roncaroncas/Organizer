from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from app.models import Task

router = APIRouter()


@router.get("/myTasks", tags=["tasks"])
async def my_tasks(request: Request) -> List[Task]:

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]
    
    sql = (f"SELECT t.id, t.taskName, t.startTime, t.endTime, t.place, t.fullDay, t.taskDescription, ts.value " 
        f"FROM tasks t "
        f"LEFT JOIN usersTasks ut ON t.id = ut.taskId "
        f"LEFT JOIN users u ON u.id = ut.userId "
        f"LEFT JOIN taskStatus ts ON ts.id = ut.statusId "
        # )
        f"WHERE u.id = ?")

    # logger.debug(sql)
    # logger.debug(userId)

    rows = db.cursor.execute(sql, [userId]).fetchall()
    # tasks = db.cursor.execute(sql).fetchall()

    # logger.debug(tasks)

    tasks = []
    for r in rows:
        tasks.append(Task(
            id= r[0], taskName= r[1], startDayTime= r[2],
            endDayTime= r[3], place= r[4], fullDay= r[5],
            taskDescription= r[6], status=r[7]))


    return (tasks)
    
@router.post("/createTask", tags=["tasks"])
async def create_task(task: Task, request: Request) -> (bool):

    logger.debug('Comecei a taskear')

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

    logger.debug(userId)

    #CRIANDO EVENTO
    sql = (f"INSERT INTO tasks "
        f"(taskName, startTime, endTime, place, fullDay, taskDescription) "
        f"VALUES (?, ?, ?, ?, ?, ?) "
        f"RETURNING id")

    val = [task.taskName, task.startDayTime, task.endDayTime, task.place , task.fullDay, task.taskDescription]

    logger.debug(val)

    taskId = db.cursor.execute(sql, val).fetchone()[0]
    db.connection.commit()

    logger.debug(taskId)

    sql = (f"INSERT INTO usersTasks  "
        f"(userId, taskId, statusId) "
        f"VALUES (?, ?, ?)")

    val = [userId, taskId, 0]
    try:
        db.cursor.execute(sql, val)
        db.connection.commit()
    except Exception as e:
        logger.error(f"Error creating task: {e}")
        raise HTTPException(status_code=500, detail="Error creating task")

    return True

@router.put("/updateTask", tags=["tasks"])
async def update_task(task: Task, request: Request) -> (bool):

    #USER ID
    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    row = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchone()
    
    if row == None:
        raise HTTPException(status_code=401, detail="Not logged in")

    #ATUALIZANDO EVENTO EVENTO
    sql = (f"UPDATE tasks "
        f"SET taskName = ?, startTime = ?, endTime = ?, place = ?, fullDay = ?, taskDescription = ? "
        f"WHERE id = ?")

    val = [task.taskName, task.startDayTime, task.endDayTime, task.place , task.fullDay, task.taskDescription, task.id]

    logger.debug(val)

    db.cursor.execute(sql, val)
    db.connection.commit()

    return True

@router.get("/task/{taskId}", tags=["tasks"])
async def get_Task_by_id(taskId: int, request: Request):

    # logger.debug(taskId)

    sql = (f"SELECT taskName, startTime, endTime, place, fullDay" 
        f"FROM tasks "
        f"WHERE id = ?")

    taskData = db.cursor.execute(sql, [taskId]).fetchall()[0]

    # logger.debug(taskData)
    
    return taskData

@router.get("/task/{taskId}/users", tags=["tasks"])
async def get_Task_by_id(taskId: int, request: Request):

    # logger.debug(taskId)

    sql = (f"SELECT u.id, u.name " 
        f"FROM usersTasks ut "
        f"LEFT JOIN users u "
        f"ON u.id = ut.userId "
        f"WHERE ut.taskId = ?")

    taskData = db.cursor.execute(sql, [taskId]).fetchall()

    # logger.debug(taskData)
    
    return taskData

@router.post("/task/{taskId}/addUser/{userId}", tags=["tasks"])
async def add_user_to_task_by_id(taskId: int, userId: int, request: Request):

    # logger.debug(userId)

    sql = (f"INSERT INTO usersTasks "
        f"(userId, taskId) "
        f"VALUES (?, ?)")

    val = [userId, taskId]
    db.cursor.execute(sql, val)
    db.connection.commit()
    
    return True