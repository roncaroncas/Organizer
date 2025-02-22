from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import db

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

#-------BANCO DE DADOS MIGUÉ
todos = [
    {
        "id": "1",
        "item": "Read a book."
    },
    {
        "id": "2",
        "item": "Cycle around town."
    }
]
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

@app.post("/login", tags=["login"])
async def generate_token(body: dict, response: Response) -> dict:

    #TODO: (formato: {"username": str, "password":str}:

    # 2) Se existe, criar um SESSION_ID no DB e retorna-lo como token <----- falta essa parte!!


    query = db.cursor.execute("SELECT id FROM users where (name == ?) AND (password == ?)", [body['username'], body['password']]).fetchall()

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
        return None #funciona! mas com erro kkkkk <--- corrigir

@app.post("/createAccount", tags=["login"])
async def create_account(body: dict) -> (bool):

    #TODO: ao receber um body (formato: {"username": str, "password":str}:

    # 1) verificar se o usuário existe

    nextId = db.cursor.execute(f"SELECT max(id) FROM users").fetchall()[0][0]+1

    logger.debug(nextId)
    logger.debug(body['username'])
    logger.debug(body['password'])

    logger.debug((nextId, body['username'], body['password']))


    db.cursor.execute("INSERT INTO users (id, name, password) VALUES (?, ?, ?)", (nextId, body['username'], body['password']))
    db.connection.commit()

    return True

@app.get("/myFriends", tags=["friends"])
async def my_friends(request: Request):

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]
    
    sql = (f"SELECT f.userid2, u2.name, u1.name " 
        f"FROM friendship f "
        f"LEFT JOIN users u1 ON u1.id = f.userid1 "
        f"LEFT JOIN users u2 ON u2.id = f.userid2 "
        f"WHERE u1.id = ?")

    logger.debug(sql)

    friends = db.cursor.execute(sql, [userId]).fetchall()

    sql = (f"SELECT f.userid1, u1.name, u2.name " 
        f"FROM friendship f "
        f"LEFT JOIN users u1 ON u1.id = f.userid1 "
        f"LEFT JOIN users u2 ON u2.id = f.userid2 "
        f"WHERE u2.id = ?")

    friends += db.cursor.execute(sql, [userId]).fetchall()

    logger.debug(friends)

    #teste para ver se está recebendo o cookie certo! (FUNCIONOU!)
    #token = request.cookies.get("token")
    
    return {"friends": friends}

@app.post("/addFriend", tags=["friends"])
async def add_friend(body: dict, request: Request) -> (bool):

    #Check if friendId exists:

    friendId = body["friendId"]

    sql = (f"SELECT 1 from users WHERE id = ?")
    existFriend = bool(db.cursor.execute(sql, [friendId]).fetchall())
    logger.debug(existFriend)

    if not existFriend:
        return False

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")
    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    sql = (f"INSERT INTO friendship "
        f"(userId1, userId2) "
        f"VALUES (?, ?)")

    db.cursor.execute(sql, [userId, friendId])
    db.connection.commit()

    return True

@app.get("/myTasks", tags=["tasks"])
async def my_tasks(request: Request):

    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]
    
    sql = (f"SELECT t.id, t.taskName, t.startTime, t.endTime " 
        f"FROM tasks t "
        f"LEFT JOIN usersTasks ut ON t.id = ut.taskId "
        f"LEFT JOIN users u ON u.id = ut.userId "
        # )
        f"WHERE u.id = ?")

    logger.debug(sql)
    logger.debug(userId)

    tasks = db.cursor.execute(sql, [userId]).fetchall()
    # tasks = db.cursor.execute(sql).fetchall()

    logger.debug(tasks)
    
    return {"tasks": tasks}
    
@app.post("/createTask", tags=["tasks"])
async def create_task(body: dict, request: Request) -> (bool):

    #USER ID
    sql = (f"SELECT users.id " 
        f"FROM tokenAuth "
        f"INNER JOIN users "
        f"ON tokenAuth.userId = users.id "
        f"WHERE token = ?")

    userId = db.cursor.execute(sql, [str(request.cookies.get("token"))]).fetchall()[0][0]

    #CRIANDO EVENTO
    sql = (f"INSERT INTO tasks "
        f"(taskName, startTime, endTime) "
        f"VALUES (?, ?, ?)")

    val = [body["taskName"], body["startTime"], body["endTime"]]
    db.cursor.execute(sql, val)
    db.connection.commit()

    #CONECTANDO EVENTO AO USUARIO QUE O CRIOU
    sql = (f"SELECT id " 
        f"FROM tasks "
        f"WHERE taskName = ? AND startTime = ? and endTime = ? "
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

@app.get("/task/{taskId}", tags=["tasks"])
async def get_Task_by_id(taskId: int, request: Request):

    logger.debug(taskId)

    sql = (f"SELECT tasks.taskName, tasks.startTime, tasks.endTime " 
        f"FROM tasks "
        f"WHERE tasks.id = ?")

    taskData = db.cursor.execute(sql, [taskId]).fetchall()[0]

    logger.debug(taskData)
    
    return taskData

@app.get("/task/{taskId}/users", tags=["tasks"])
async def get_Task_by_id(taskId: int, request: Request):

    logger.debug(taskId)

    sql = (f"SELECT u.id, u.name " 
        f"FROM usersTasks ut "
        f"LEFT JOIN users u "
        f"ON u.id = ut.userId "
        f"WHERE ut.taskId = ?")

    taskData = db.cursor.execute(sql, [taskId]).fetchall()

    logger.debug(taskData)
    
    return taskData

@app.post("/task/{taskId}/addUser/{userId}", tags=["tasks"])
async def add_user_to_task_by_id(taskId: int, userId: int, request: Request):

    logger.debug(userId)

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

    logger.debug(userData)
    
    return userData

@app.get("/profile/{id}", tags=["profile"])
async def get_profile_by_id(id: int, request: Request):

    logger.debug(id)

    sql = (f"SELECT users.id, users.name, users.dateOfBirth " 
        f"FROM users "
        f"WHERE users.id = ?")

    userData = db.cursor.execute(sql, [id]).fetchall()[0]

    logger.debug(userData)
    
    return userData

