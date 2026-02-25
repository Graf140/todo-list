from asyncpg import Connection
from app.models.users import UserDB


class UserRepository:
    def __init__(self, db: Connection):
        self.db = db

    async def get_all_users(self):
        rows = await self.db.fetch("SELECT * FROM users")
        return [UserDB.model_validate(dict(row)) for row in rows]