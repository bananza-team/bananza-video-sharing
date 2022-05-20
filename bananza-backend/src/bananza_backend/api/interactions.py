from bananza_backend.models import Comment, CommentCreate, VideoReactionCount, ReactionCreate, Reaction
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.interactions.comment import CommentRepo
from bananza_backend.services.interactions.react import ReactionRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/video/interact", tags=["Video interactions"])


@router.post("/comment", summary="Post a comment to a video", response_model=Comment)
async def add_comment(comment: CommentCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    comment = CommentRepo(db).add(comment=comment, user_id=user.id)
    return comment


@router.get("/reactions", summary="Get a count of likes and dislikes", response_model=VideoReactionCount)
async def get_reactions(video_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    AuthHandler(db).get_current_user_by_token(token)
    return ReactionRepo(db).get_count_on_video(video_id)
