from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class User(BaseModel):  #FROM users
    id: Optional[int] = None
    name: Optional[str] = None
    password: Optional[str] = None
    dateOfBirth: Optional[int] = None
    username: Optional[str] = None
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

class Tempo(BaseModel):
    id: Optional[int] = None
    name: str
    startTimestamp: str   #salvo em timestamp!
    endTimestamp: str   #salvo em timestamp!
    place: Optional[str]
    fullDay: bool
    description: str
    status: Optional[str] = None
    parentId: Optional[int] = None

# class GroupTask(BaseModel):
#     id: Optional[int]
#     name: str
#     parentId: Optional[int]

class Post(BaseModel):
    id: Optional[int] = None
    authorName: Optional[str] = None
    authorId: Optional[int] = None
    groupId: Optional[int] = None
    text: str
    timestamp: Optional[datetime] = None
    type: Optional[str] = None

class Notification(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    statusId: Optional[int] = None

class Profile(BaseModel):
    id: int
    name: str
    birthday: Optional[datetime]