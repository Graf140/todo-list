from typing import List, Optional
from datetime import datetime

from backend.src.db.context import get_db_cursor


class CommentRepository:
    @staticmethod
    def get_by_task_id(task_id: int, limit: int = 5) -> List[dict]:
        with get_db_cursor() as cursor:
            cursor.execute(
                """SELECT c.comment_id, c.task_id, c.user_id, c.text, c.created_at,
                          u.first_name, u.last_name
                   FROM comments c
                   JOIN users u ON c.user_id = u.user_id
                   WHERE c.task_id = %s
                   ORDER BY c.created_at DESC
                   LIMIT %s""",
                (task_id, limit)
            )
            return cursor.fetchall()

    @staticmethod
    def create(task_id: int, user_id: int, text: str) -> dict:
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO comments (task_id, user_id, text, created_at)
                   VALUES (%s, %s, %s, %s)
                   RETURNING c.*, u.first_name || ' ' || u.last_name as user_name
                   FROM comments c
                   JOIN users u ON c.user_id = u.user_id
                   WHERE c.comment_id = (SELECT LASTVAL())""",
                (task_id, user_id, text, datetime.utcnow())
            )
            return cursor.fetchone()

    @staticmethod
    def delete(comment_id: int) -> bool:
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM comments WHERE comment_id = %s", (comment_id,))
            return cursor.rowcount > 0