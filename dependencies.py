from asyncpg import Connection
from fastapi import Depends
from app.repositories.users import UserRepository
from app.services.users import UserService
from app.db.connection import get_db


def get_user_repo(db: Connection = Depends(get_db)):
    return UserRepository(db)


def get_user_service(repo: UserRepository = Depends(get_user_repo)):
    return UserService(repo)