from pydantic import BaseModel
from typing import Optional, List

class User(BaseModel):  #FROM users
    id: Optional[int] = None
    name: Optional[str] = None
    password: str
    dateOfBirth: Optional[int] = None
    username: str
    email: Optional[str] = None

class Token(BaseModel):
    token: str

class Friend(BaseModel): #Friendship
    friendId: int
    friendName: Optional[str] = None
    status: Optional[str]
    statusNmbr: Optional[int]

class Group(BaseModel): #Groups
    id: int = None
    name: Optional[str] = None
    description: Optional[str] = None
    users: Optional[List[User]] = None

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

class Post(BaseModel):
    id: Optional[int] = None
    authorName: Optional[str] = None
    authorId: Optional[int] = None
    groupPostId: Optional[int] = None
    text: str
    timestamp: Optional[str] = None
    type: Optional[str] = None