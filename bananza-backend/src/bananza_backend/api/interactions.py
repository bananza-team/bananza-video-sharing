from bananza_backend.models import Comment, CommentCreate, VideoReactionCount,\
    ReactionCreate, Reaction, ReportedVideo, ReportedVideoCreate
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.interactions.comment import CommentRepo
from bananza_backend.services.interactions.react import ReactionRepo
from bananza_backend.services.interactions.report import ReportRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/video/interact", tags=["Video interactions"])


@router.post("/comment", summary="Post a comment to a video", response_model=Comment)
async def add_comment(comment: CommentCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    comment = CommentRepo(db).add(comment=comment, user_id=user.id)
    return comment


@router.delete("/comment/{comment_id}", summary="Delete a comment")
async def delete_comment(comment_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    CommentRepo(db).delete_by_id(comment_id=comment_id, user_that_deletes=user)
    return JSONResponse(content={"message": f"Comment with id {comment_id} deleted successfully"})


@router.patch("/react", summary="Add a like reaction to a video", response_model=Reaction)
async def add_reaction(reaction: ReactionCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    reaction = ReactionRepo(db).add_reaction(reaction=reaction, user_id=user.id)
    return reaction


@router.get("/reactions", summary="Get a count of likes and dislikes", response_model=VideoReactionCount)
async def get_reactions(video_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    return ReactionRepo(db).get_count_on_video(video_id, user.id)


@router.post("/report", summary="Report a video to platform managers", response_model=ReportedVideo)
async def add_report(report: ReportedVideoCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    return ReportRepo(db).add_report(report=report, reporter_id=user.id)


@router.get("/report", summary="Get a list of reports (manager/admin only)", response_model=List[ReportedVideo])
async def get_reports(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    return ReportRepo(db).get_all(user_that_queried=user)
