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

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

@app.get("/todo", tags=["todos"])
async def get_todos() -> dict:
    return { "data": todos }

@app.post("/todo", tags=["todos"])
async def add_todo(todo: dict) -> dict:
    todos.append(todo)
    return {
        "data": { "Todo added." }
    }

@app.put("/todo/{id}", tags=["todos"])
async def update_todo(id: int, body: dict) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todo["item"] = body["item"]
            return {
                "data": f"Todo with id {id} has been updated."
            }

    return {
        "data": f"Todo with id {id} not found."
    }

@app.delete("/todo/{id}", tags=["todos"])
async def delete_todo(id: int) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todos.remove(todo)
            return {
                "data": f"Todo with id {id} has been removed."
            }

    return {
        "data": f"Todo with id {id} not found."
    }

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

    fields = "users.id"
    table = "tokenAuth"
    tableJoin = "users"

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

    