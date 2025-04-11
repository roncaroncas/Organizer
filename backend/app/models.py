from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --------------------------------------

class User(BaseModel):  #FROM users
    id: Optional[int] = None
    name: Optional[str] = None
    password: Optional[str] = None
    dateOfBirth: Optional[int] = None
    username: Optional[str] = None
    email: Optional[str] = None

# --------------------------------------

class Token(BaseModel):
    token: str

# --------------------------------------

class Friend(BaseModel): #Friendship
    friendId: int
    friendName: Optional[str] = None
    status: Optional[str]
    statusNmbr: Optional[int]

# --------------------------------------

class Group(BaseModel): #Groups
    id: int = None
    name: Optional[str] = None
    description: Optional[str] = None
    users: Optional[List[User]] = None

# ---------- TEMPO ---------------------

class TempoBase(BaseModel):
    name: str
    startTimestamp: datetime
    endTimestamp: datetime
    place: str
    fullDay: bool
    description: str
    status: Optional[str] = None
    statudId: Optional[int] = None
    parentId: Optional[int] = None

class TempoRequest(TempoBase):
    id: Optional[int] = None

class TempoResponse(TempoBase):
    id: int

# --------------------------------------

class Post(BaseModel):
    id: Optional[int] = None
    authorName: Optional[str] = None
    authorId: Optional[int] = None
    groupId: Optional[int] = None
    text: str
    timestamp: Optional[datetime] = None
    type: Optional[str] = None

# --------------------------------------

class Notification(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    statusId: Optional[int] = None
    
# --------------------------------------

class Profile(BaseModel):
    id: int
    name: str
    birthday: Optional[datetime]
    
# --------------------------------------
    
# --------------------------------------