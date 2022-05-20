from bananza_backend.db.sql_models import ReactionModel
from bananza_backend.models import Reaction, ReactionCreate, ReactionStateEnum

from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from loguru import logger


class ReactionRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

    def get(self, user_id) -> ReactionModel:
        return self.db.query(ReactionModel).filter(ReactionModel.user_id == user_id).first()

    def get_count_on_video(self, video_id):
        likes = self.db.query(ReactionModel).filter(ReactionModel.video_id.like(video_id),
                                                    ReactionModel.state.like(ReactionStateEnum.like)).all()
        dislikes = self.db.query(ReactionModel).filter(ReactionModel.video_id.like(video_id),
                                                       ReactionModel.state.like(ReactionStateEnum.dislike)).all()
        return {
            "likes": len(likes),
            "dislikes": len(dislikes)
        }

