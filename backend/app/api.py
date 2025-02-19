from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import db

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
async def generate_token(body: dict) -> dict:

    #TODO: ao receber um body (formato: {"username": str, "password":str}:

    # 1) verificar se o usuário existe
    # 2) Se existe, criar um SESSION_ID no DB e retorna-lo como token <----- falta essa parte!!

    query = db.cursor.execute("SELECT id FROM users where (name == ?) AND (password == ?)", [body['username'], body['password']]).fetchall()

    if len(query):
        userId = query[0][0]
        return {"token": userId}
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

    