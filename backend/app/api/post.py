from fastapi import APIRouter, Request, HTTPException, Response
from app.database.connection import db
from app.config import logger
from typing import List

from datetime import datetime, timezone

from app.models import Post

from app.database.queries.auth_queries import getUserIdByToken
from app.database.queries.post_queries import getAllPosts, addNewPost, deletePost

router = APIRouter()

@router.get("/getAll")
async def get_all_posts(request: Request) -> List[Post]:

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    # GET ALL POSTS
    rows = await getAllPosts() # <--- ta pegando todos os posts gerais kkkkk

    posts = []
    for r in rows:

        if(r["authorId"] == userId):
            postType = "self"
        else:
            postType = None

        posts.append(Post(
            id= r["id"],
            authorId = r["authorId"],
            authorName = r["name"],
            groupPostId= r["groupId"],
            text= r["text"],
            timestamp= r["timestamp"],
            type= postType
        ))

    return (posts)


@router.post("/addNew")
async def add_new_post(post: Post, request: Request):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    await addNewPost(userId, post.text)

    return True

@router.delete("/delete/{postId}")
async def delete_post(postId: int, request: Request):

    # Check if logged in
    userId = await getUserIdByToken(str(request.cookies.get("token")))
    if not(userId):
        raise HTTPException(status_code=401, detail="Not logged in")

    await deletePost(postId)

    return True

