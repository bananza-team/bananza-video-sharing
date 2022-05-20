from bananza_backend.models import Comment, CommentCreate
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.interactions.comment import CommentRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/video/interact", tags=["Video interactions"])


@router.post("/comment", summary="Get a list of all videos from db", response_model=Comment)
async def add_comment(comment: CommentCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    comment = CommentRepo(db).add(comment=comment, user_id=user.id)
    return comment
