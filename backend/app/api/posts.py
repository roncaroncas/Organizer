from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from datetime import datetime, timezone

from app.models import Post

router = APIRouter()

@router.get("/getAll")
async def get_all_posts(request: Request) -> List[Post]:

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


    
    sql = (f"SELECT p.id, u.id, u.name, p.groupPostId, p.text, p.timestamp " 
        f"FROM posts p "
        f"LEFT JOIN users u ON u.id = p.whoId "
        f"ORDER BY datetime(p.timestamp) DESC"
        )

    # logger.debug(sql)
    # logger.debug(userId)

    # rows = db.cursor.execute(sql, [userId]).fetchall()
    rows = db.cursor.execute(sql).fetchall()

    posts = []
    for r in rows:
        posts.append(Post(
            id= r[0],
            authorId = r[1],
            authorName = r[2],
            groupPostId= r[3],
            text= r[4],
            timestamp= r[5]
        ))

    return (posts)


@router.post("/addNew")
async def add_new_post(post: Post, request: Request):

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

    #CRIANDO POST
    sql = (f"INSERT INTO posts "
        f"(whoId, groupPostId, text, timestamp) "
        f"VALUES (?, ?, ?, ?) "
        )
    val = [userId, post.groupPostId, post.text, datetime.now(timezone.utc).isoformat()]

    try:
        db.cursor.execute(sql, val)
        db.connection.commit()
    except Exception as e:
        logger.error(f"Error creating task: {e}")
        raise HTTPException(status_code=500, detail="Error creating task")

    return True
