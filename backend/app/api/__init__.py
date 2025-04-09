from fastapi import APIRouter
from ..api import friend, auth, tempo, profile, notification, post, group

router = APIRouter()

router.include_router(auth.router, prefix="/account", tags=["login"])

router.include_router(profile.router, prefix="/profile", tags=["profile"])
router.include_router(friend.router, prefix="/friend", tags=["friends"])
router.include_router(tempo.router, prefix="/tempo", tags=["tempo"])

router.include_router(notification.router, prefix="/notification", tags=["notification"])
router.include_router(post.router, prefix="/posts", tags=["feed"])
router.include_router(group.router, prefix="/group", tags=["group"])


# router.include_router(tasksGroups.router, tags=["groupTasks"]) # prefix="/groupTasks", 
