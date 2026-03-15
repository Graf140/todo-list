from fastapi import APIRouter

from backend.src.api.v1 import auth, tasks, users, comments

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(tasks.router)
api_router.include_router(users.router)
api_router.include_router(comments.router)