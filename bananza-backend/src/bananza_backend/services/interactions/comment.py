from bananza_backend.db.sql_models import CommentModel
from bananza_backend.models import Comment, CommentCreate

from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from loguru import logger


class CommentRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

    def add(self, comment: CommentCreate, user_id: int) -> Comment:
        if not comment.content:
            raise HTTPException(status_code=403, detail="Comment must not be empty")

        new_comment = CommentModel(
            video_id=comment.video_id,
            user_id=user_id,
            content=comment.content
        )

        try:
            self.db.add(new_comment)
            self.db.commit()
            self.db.refresh(new_comment)
            return new_comment
        except Exception as e:
            logger.error(f"Couldn't add comment {new_comment} to db. Reason: {e}")
            raise e

