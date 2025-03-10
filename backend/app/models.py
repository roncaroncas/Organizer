from pydantic import BaseModel
from typing import Optional

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

class GroupTask(BaseModel):
    id: Optional[int]
    name: str
    parentId: Optional[int]
