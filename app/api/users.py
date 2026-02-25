from fastapi import APIRouter, Depends
from app.schemas.users import UserResponse
from dependencies import get_user_service
from app.services.users import UserService
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/all", response_model=list[UserResponse])
async def get_all_users(service: UserService = Depends(get_user_service)):
    users = await service.get_all_users()
    return users