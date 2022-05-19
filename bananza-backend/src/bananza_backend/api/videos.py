from bananza_backend.models import Video, VideoCreate
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.videos.repository import VideoRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

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


@router.get("/all", summary="Get a list of all videos from db")
async def get_all_videos(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    AuthHandler(db).get_current_user_by_token(token)
    all_videos = await VideoRepo(db).get_all()
    return all_videos
