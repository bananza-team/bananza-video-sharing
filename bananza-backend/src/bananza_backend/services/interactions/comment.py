from bananza_backend.db.sql_models import CommentModel
from bananza_backend.exceptions import EntityNotFound, ForbiddenAccess
from bananza_backend.models import Comment, CommentCreate, User, UserTypeEnum

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

    def get_by_id(self, comment_id) -> CommentModel:
        found_comment = self.db.query(CommentModel).filter(CommentModel.id == comment_id).first()
        if not found_comment:
            raise EntityNotFound(message=f"Comment with id {comment_id} not found")
        return found_comment

    def delete_by_id(self, comment_id: int, user_that_deletes: User):
        found_comment = self.get_by_id(comment_id)

        video_owner_id = found_comment.video.owner.id
        deleter_id = user_that_deletes.id
        deleter_type = user_that_deletes.type

        if found_comment.user_id != deleter_id:
            if video_owner_id != deleter_id:
                if not (deleter_type == UserTypeEnum.manager or deleter_type == UserTypeEnum.admin):
                    raise ForbiddenAccess(message=f"Couldn't delete comment {comment_id}",
                                          details=f"User with id {deleter_id} doesn't own comment with id {comment_id}")

        try:
            self.db.delete(found_comment)
            self.db.commit()
            logger.info(f"Comment with id {comment_id} has been successfully deleted")
        except Exception as e:
            logger.error(f"Couldn't delete comment with id {comment_id}. Reason: {e}")
            raise HTTPException(status_code=403, detail=f"Couldn't delete comment.")