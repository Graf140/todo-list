from pydantic import BaseModel


class UserResponse(BaseModel):
    first_name: str
    last_name: str
    user_id: str
    login: str
