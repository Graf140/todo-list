from backend.src.repositories.comment_repo import CommentRepository
from backend.src.repositories.task_repo import TaskRepository
from backend.src.utils.validators import validate_comment_text, validate_task_id, ValidationError


class CommentService:

    @staticmethod
    def create_comment(task_id: int, text: str, user_id: int) -> dict:
        task_id = validate_task_id(task_id)

        # check task exists
        task = TaskRepository.get_by_id(task_id)
        if not task:
            raise ValidationError("Task not found")

        text = validate_comment_text(text)

        comment = CommentRepository.create(
            task_id=task_id,
            user_id=user_id,
            text=text
        )

        comment["user_name"] = f"{comment['first_name']} {comment['last_name']}"
        if "first_name" in comment:
            del comment["first_name"]
        if "last_name" in comment:
            del comment["last_name"]

        return comment

    @staticmethod
    def delete_comment(comment_id: int, current_user: dict) -> dict:
        CommentRepository.delete(comment_id)
        return {"message": "Comment deleted"}