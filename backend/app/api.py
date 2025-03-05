from fastapi import FastAPI, Response, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .database import db

import sqlite3

from pydantic import BaseModel
from typing import Optional, List

import secrets

import logging
import sys

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


##########################################

#OBJETOS
class User(BaseModel):  #FROM users
    id: Optional[int] = None
    name: Optional[str] = None
    password: str
    dateOfBith: Optional[int] = None
    username: str = None
    email: Optional[str] = None

class Token(BaseModel):
    token: str

class Friend(BaseModel): #Friendship
    friendId: int
    friendName: Optional[str] = None
    status: Optional[str]
    statusNmbr: Optional[int]

class Task(BaseModel):
    id: Optional[int] = None
    taskName: str
    startDayTime: str   #salvo em timestamp!
    endDayTime: str   #salvo em timestamp!
    place: Optional[str]
    fullDay: bool
    taskDescription: str
    status: Optional[str] = None



######################   LOGIN   ##############################

@app.post("/login", tags=["login"])
async def generate_token(user: User, response: Response) -> Token:

    # 2) Se existe, criar um SESSION_ID no DB e retorna-lo como token <----- falta essa parte!!

    query = db.cursor.execute("SELECT id FROM users where (username == ?) AND (password == ?)", [user.username, user.password]).fetchall()

    if len(query) == 1:

        #id = id (auto increment)
        userId = query[0][0]

        token = secrets.token_hex(nbytes=16)

        status = 10 #0 = Inativo, #10 = Ativo
        validUntil = 0

        #Desativar todos os outros tokens
        db.cursor.execute("UPDATE tokenAuth SET status = 0 WHERE userId = ?", [userId])

        #Ativar o token novo
        db.cursor.execute("INSERT INTO tokenAuth (userId, token, status, validUntil) VALUES (?, ?, ?, ?)",
            (userId, token, status, validUntil))
        db.connection.commit()

        logger.debug("salvei o token em tokenAuth!")

        return {"token": token}

    else:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

@app.post("/createAccount", tags=["login"])
async def create_account(user: User):

    try:
        db.cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", [user.username, user.password])
        db.connection.commit()
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail="Contraint Error")

    return


#####################  FRIENDS     ###############################

@app.get("/myFriends", tags=["friends"])
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

@app.post("/addFriend", tags=["friends"])
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


@app.delete("/deleteFriend", tags=["friends"])
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

@app.put("/acceptFriend", tags=["friends"])
async def delete_friend(body: dict, request: Request) -> (bool):

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



##------------------------------------------------------------------------------

@app.get("/myTasks", tags=["tasks"])
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
    
@app.post("/createTask", tags=["tasks"])
async def create_task(task: Task, request: Request) -> (bool):

    logger.debug('Comecei a taskear')

    #USER ID
    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    logger.debug(userId)


    #CRIANDO EVENTO
    sql = (f"INSERT INTO tasks "
        f"(taskName, startTime, endTime, place, fullDay, taskDescription) "
        f"VALUES (?, ?, ?, ?, ?, ?)")

    val = [task.taskName, task.startDayTime, task.endDayTime, task.place , task.fullDay, task.taskDescription]

    logger.debug(val)

    db.cursor.execute(sql, val)
    db.connection.commit()

    #CONECTANDO EVENTO AO USUARIO QUE O CRIOU
    sql = (f"SELECT id " 
        f"FROM tasks "
        f"WHERE taskName = ? AND startTime = ? and endTime = ? and place = ? and fullDay = ? and taskDescription = ?"
        f"ORDER BY id DESC "
        f"LIMIT 1")

    #TO PERGUNTANDO O ID DE UM JEITO NAO OTIMIZADO CTZ
    taskId = db.cursor.execute(sql, val).fetchall()[0][0]

    logger.debug(taskId)

    sql = (f"INSERT INTO usersTasks  "
        f"(userId, taskId, statusId) "
        f"VALUES (?, ?, ?)")

    val = [userId, taskId, 0]
    db.cursor.execute(sql, val)
    db.connection.commit()

    return True

@app.put("/updateTask", tags=["tasks"])
async def update_task(task: Task, request: Request) -> (bool):

    logger.debug("Finge que atualizei a task kkkk")

    # logger.debug('Comecei a taskear')

    # #USER ID
    # sql = (f"SELECT users.id " 
    #     f"FROM tokenAuth "
    #     f"INNER JOIN users "
    #     f"ON tokenAuth.userId = users.id "
    #     f"WHERE token = ?")

    # userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    # logger.debug(userId)


    # #CRIANDO EVENTO
    # sql = (f"INSERT INTO tasks "
    #     f"(taskName, startTime, endTime, place, fullDay, taskDescription) "
    #     f"VALUES (?, ?, ?, ?, ?, ?)")

    # val = [task.taskName, task.startDayTime, task.endDayTime, task.place , task.fullDay, task.taskDescription]

    # logger.debug(val)

    # db.cursor.execute(sql, val)
    # db.connection.commit()

    # #CONECTANDO EVENTO AO USUARIO QUE O CRIOU
    # sql = (f"SELECT id " 
    #     f"FROM tasks "
    #     f"WHERE taskName = ? AND startTime = ? and endTime = ? and place = ? and fullDay = ? and taskDescription = ?"
    #     f"ORDER BY id DESC "
    #     f"LIMIT 1")

    # #TO PERGUNTANDO O ID DE UM JEITO NAO OTIMIZADO CTZ
    # taskId = db.cursor.execute(sql, val).fetchall()[0][0]

    # logger.debug(taskId)

    # sql = (f"INSERT INTO usersTasks  "
    #     f"(userId, taskId, statusId) "
    #     f"VALUES (?, ?, ?)")

    # val = [userId, taskId, 0]
    # db.cursor.execute(sql, val)
    # db.connection.commit()

    return True

@app.get("/task/{taskId}", tags=["tasks"])
async def get_Task_by_id(taskId: int, request: Request):

    # logger.debug(taskId)

    sql = (f"SELECT taskName, startTime, endTime, place, fullDay" 
        f"FROM tasks "
        f"WHERE id = ?")

    taskData = db.cursor.execute(sql, [taskId]).fetchall()[0]

    # logger.debug(taskData)
    
    return taskData

@app.get("/task/{taskId}/users", tags=["tasks"])
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

@app.post("/task/{taskId}/addUser/{userId}", tags=["tasks"])
async def add_user_to_task_by_id(taskId: int, userId: int, request: Request):

    # logger.debug(userId)

    sql = (f"INSERT INTO usersTasks "
        f"(userId, taskId) "
        f"VALUES (?, ?)")

    val = [userId, taskId]
    db.cursor.execute(sql, val)
    db.connection.commit()
    
    return True

@app.get("/profile", tags=["profile"])
async def my_profile(request: Request):

    sql = (f"SELECT users.id, users.name, users.dateOfBirth " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userData = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0]

    # logger.debug(userData)
    
    return userData

@app.get("/profile/{id}", tags=["profile"])
async def get_profile_by_id(id: int, request: Request):

    # logger.debug(id)

    sql = (f"SELECT users.id, users.name, users.dateOfBirth " 
        f"FROM users "
        f"WHERE users.id = ?")

    userData = db.cursor.execute(sql, [id]).fetchall()[0]

    # logger.debug(userData)
    
    return userData

@app.get("/myNotifications", tags=["notification"])
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

    values = [userId, 0]   #ut.taskStatus = 0 -> "Invited"

    results = db.cursor.execute(sql, values).fetchall()

    return results

@app.put("/updateNotificationStatus", tags=["notification"])
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

    # values = [body['idUserTask'], userId]   #ut.taskStatus = 0 -> "Invited"
    values = [body['newStatus'], body['idUserTask']]  #ut.taskStatus = 0 -> "Invited"

    logger.debug(values)


    db.cursor.execute(sql, values)
    db.connection.commit()

    return True


#####################

    # #-------BANCO DE DADOS MIGUÉ
# todos = [
#     {
#         "id": "1",
#         "item": "Read a book."
#     },
#     {
#         "id": "2",
#         "item": "Cycle around town."
#     }
# ]

#----------------------

# @app.get("/", tags=["root"])
# async def read_root() -> dict:
#     return {"message": "Welcome to your todo list."}

# @app.get("/todo", tags=["todos"])
# async def get_todos() -> dict:
#     return { "data": todos }

# @app.post("/todo", tags=["todos"])
# async def add_todo(todo: dict) -> dict:
#     todos.append(todo)
#     return {
#         "data": { "Todo added." }
#     }

# @app.put("/todo/{id}", tags=["todos"])
# async def update_todo(id: int, body: dict) -> dict:
#     for todo in todos:
#         if int(todo["id"]) == id:
#             todo["item"] = body["item"]
#             return {
#                 "data": f"Todo with id {id} has been updated."
#             }

#     return {
#         "data": f"Todo with id {id} not found."
#     }

# @app.delete("/todo/{id}", tags=["todos"])
# async def delete_todo(id: int) -> dict:
#     for todo in todos:
#         if int(todo["id"]) == id:
#             todos.remove(todo)
#             return {
#                 "data": f"Todo with id {id} has been removed."
#             }

#     return {
#         "data": f"Todo with id {id} not found."
#     }

