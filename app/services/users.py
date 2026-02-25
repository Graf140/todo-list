from app.schemas.users import UserResponse
from app.repositories.users import UserRepository


class UserService():
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def get_all_users(self) -> list[UserResponse]:
        users_db = await self.repo.get_all_users()
        return [
            UserResponse(
                user_id=u.user_id,
                first_name=u.first_name,
                last_name=u.last_name,
                login=u.login
            )
            for u in users_db
        ]