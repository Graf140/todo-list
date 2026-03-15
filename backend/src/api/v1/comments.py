from fastapi import APIRouter, HTTPException

from backend.src.services.comment_service import CommentService
from backend.src.utils.validators import ValidationError

router = APIRouter(prefix="/tasks/{task_id}/comments", tags=["Comments"])

@router.post("")
def create_comment(task_id: int, request: dict, current_user: dict = None):
    try:
        return CommentService.create_comment(
            task_id=task_id,
            text=request.get("text"),
            user_id=current_user["user_id"]
        )
    except ValidationError as e:
        status_code = 404 if "not found" in e.message.lower() else 400
        raise HTTPException(status_code=status_code, detail={e.field: e.message} if e.field else e.message)

@router.delete("/{comment_id}")
def delete_comment(task_id: int, comment_id: int, current_user: dict = None):
    try:
        return CommentService.delete_comment(comment_id, current_user)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.message)