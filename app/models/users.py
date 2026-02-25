from pydantic import BaseModel


class UserDB(BaseModel):
    user_id: str
    first_name: str
    last_name: str
    login: str
    password_hash: str

    class Config:
        from_attributes = True