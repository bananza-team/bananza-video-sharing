from bananza_backend.db.sql_models import ReactionModel
from bananza_backend.models import Reaction, ReactionCreate, ReactionStateEnum

from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from loguru import logger


class ReactionRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

    def get(self, user_id: int, video_id: int) -> ReactionModel:
        return self.db.query(ReactionModel).filter(ReactionModel.user_id.like(user_id),
                                                   ReactionModel.video_id.like(video_id)).first()

    def get_count_on_video(self, video_id: int, user_id: int):
        likes = self.db.query(ReactionModel).filter(ReactionModel.video_id.like(video_id),
                                                    ReactionModel.state.like(ReactionStateEnum.like)).all()
        dislikes = self.db.query(ReactionModel).filter(ReactionModel.video_id.like(video_id),
                                                       ReactionModel.state.like(ReactionStateEnum.dislike)).all()
        existing_reaction = self.get(user_id, video_id)
        if not existing_reaction:
            return {
                "likes": len(likes),
                "dislikes": len(dislikes),
                "current_user_reaction": ReactionStateEnum.neutral
            }
        return {
            "likes": len(likes),
            "dislikes": len(dislikes),
            "current_user_reaction": existing_reaction.state
        }

    def add_reaction(self, reaction: ReactionCreate, user_id: int) -> Reaction:
        if not reaction.state:
            raise HTTPException(status_code=403, detail="Reaction must have a state")

        existing_reaction_from_this_user = self.get(user_id, reaction.video_id)

        if not existing_reaction_from_this_user:
            return self.__add_reaction_in_db(reaction, user_id)

        existing_reaction_state = existing_reaction_from_this_user.state
        new_reaction_state = reaction.state

        if existing_reaction_state == ReactionStateEnum.neutral:
            existing_reaction_from_this_user.state = new_reaction_state
        else:
            if existing_reaction_state == ReactionStateEnum.like:
                if new_reaction_state == ReactionStateEnum.dislike:
                    existing_reaction_from_this_user.state = ReactionStateEnum.dislike
                elif new_reaction_state == ReactionStateEnum.like:
                    existing_reaction_from_this_user.state = ReactionStateEnum.neutral
            else:
                if new_reaction_state == ReactionStateEnum.like:
                    existing_reaction_from_this_user.state = ReactionStateEnum.like
                elif new_reaction_state == ReactionStateEnum.dislike:
                    existing_reaction_from_this_user.state = ReactionStateEnum.neutral

        self.db.commit()
        self.db.refresh(existing_reaction_from_this_user)
        return existing_reaction_from_this_user

    def __add_reaction_in_db(self, reaction: ReactionCreate, user_id: int) -> Reaction:
        new_reaction = ReactionModel(
            video_id=reaction.video_id,
            user_id=user_id,
            state=reaction.state
        )

        try:
            self.db.add(new_reaction)
            self.db.commit()
            self.db.refresh(new_reaction)
            return new_reaction
        except Exception as e:
            logger.error(f"Couldn't add Reaction {new_reaction} to db. Reason: {e}")
            raise e
