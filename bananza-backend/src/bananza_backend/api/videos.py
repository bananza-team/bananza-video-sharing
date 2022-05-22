from bananza_backend.models import Video, VideoCreate, VideoForSearch
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.videos.repository import VideoRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/video", tags=["Videos"])


@router.post("/", summary="Upload a video", response_model=Video)
async def upload_video(video_details: VideoCreate = Depends(), video_file: UploadFile = File(...),
                       thumbnail_file: UploadFile = File(...), db: Session = Depends(get_db),
                       token: str = Depends(oauth2_scheme)):

    current_user = AuthHandler(db).get_current_user_by_token(token)
    video_repo = VideoRepo(db)
    new_video = await video_repo.add(owner_id=current_user.id, details=video_details,
                                     video_file=video_file, thumbnail_file=thumbnail_file)

    return new_video


@router.patch("/{video_id}", summary="Edit a video title/description", response_model=Video)
async def edit_video(video_id: int, video_details: VideoCreate = Depends(), db: Session = Depends(get_db),
                     token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    video_repo = VideoRepo(db)
    new_video = await video_repo.edit_details(video_id=video_id, user_that_edits=current_user,new_details=video_details)

    return new_video


@router.delete("/{video_id}", summary="Delete a video")
async def delete_video(video_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    video_repo = VideoRepo(db)
    await video_repo.delete(video_id=video_id, user_that_deletes=current_user)

    return JSONResponse(content={"message": f"Video with id {video_id} deleted successfully"})


@router.get("/all", summary="Get a list of all videos from db", response_model=List[VideoForSearch])
async def get_all_videos(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    AuthHandler(db).get_current_user_by_token(token)
    all_videos = await VideoRepo(db).get_all()
    return all_videos


@router.get("/{video_id}", summary="Get video details of a particular video", response_model=Video)
async def get_video_by_id(video_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    AuthHandler(db).get_current_user_by_token(token)
    video = await VideoRepo(db).get_by_id(video_id)
    return video
