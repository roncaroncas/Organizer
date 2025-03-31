from fastapi import APIRouter
from ..api import friends, auth, tasks, tasksGroups, profile, notification, posts, group

router = APIRouter()

router.include_router(auth.router, tags=["login"]) # prefix="/auth", 
router.include_router(friends.router, tags=["friends"]) # prefix="/friends", 
router.include_router(tasks.router, tags=["tasks"]) # prefix="/tasks", 
router.include_router(tasksGroups.router, tags=["groupTasks"]) # prefix="/groupTasks", 
router.include_router(profile.router, tags=["profile"]) # prefix="/profile",

router.include_router(notification.router, prefix="/notification", tags=["notification"])
router.include_router(posts.router, prefix="/posts", tags=["feed"])
router.include_router(group.router, prefix="/group", tags=["group"])