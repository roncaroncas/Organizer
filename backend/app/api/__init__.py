from fastapi import APIRouter
from ..api import friends, auth, tempo, profile, notification, post, group

router = APIRouter()

router.include_router(auth.router, tags=["login"]) # prefix="/auth", 
router.include_router(friends.router, tags=["friends"]) # prefix="/friends", 
router.include_router(tempo.router, prefix="/tempo", tags=["tempo"]) # prefix="/tasks", 
# router.include_router(tasksGroups.router, tags=["groupTasks"]) # prefix="/groupTasks", 
router.include_router(profile.router, tags=["profile"]) # prefix="/profile",

router.include_router(notification.router, prefix="/notification", tags=["notification"])
router.include_router(post.router, prefix="/posts", tags=["feed"])
router.include_router(group.router, prefix="/group", tags=["group"])


