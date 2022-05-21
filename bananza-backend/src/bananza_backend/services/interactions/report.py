from bananza_backend.db.sql_models import ReportedVideoModel
from bananza_backend.models import ReportedVideo, ReportedVideoCreate

from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from loguru import logger


class ReportRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

    def get_by_user_and_video_id(self, reporter_id: int, video_id: int) -> ReportedVideoModel:
        return self.db.query(ReportedVideoModel).filter(ReportedVideoModel.reporter_id.like(reporter_id),
                                                        ReportedVideoModel.video_id.like(video_id)).first()

