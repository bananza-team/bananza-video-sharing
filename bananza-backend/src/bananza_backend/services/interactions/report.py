from bananza_backend.db.sql_models import ReportedVideoModel
from bananza_backend.models import ReportedVideo, ReportedVideoCreate, User, UserTypeEnum
from bananza_backend.exceptions import ForbiddenAccess

from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from loguru import logger


class ReportRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

    def get_by_user_and_video_id(self, reporter_id: int, video_id: int) -> ReportedVideoModel:
        return self.db.query(ReportedVideoModel).filter(ReportedVideoModel.reporter_id.like(reporter_id),
                                                        ReportedVideoModel.video_id.like(video_id)).first()

    def get_all(self, user_that_queried: User):
        if user_that_queried.type not in [UserTypeEnum.manager, UserTypeEnum.admin]:
            raise ForbiddenAccess(message="Access denied to viewing reports",
                                  details=f"User with id {user_that_queried.id} is not a manager or admin.")
        return self.db.query(ReportedVideoModel).all()

    def add_report(self, report: ReportedVideoCreate, reporter_id: int) -> ReportedVideo:
        existing_report_of_user_on_this_video = self.get_by_user_and_video_id(reporter_id, report.video_id)

        # TODO: validate that the reported video is not owned by the user himself (not prioritary/necesarry)
        if existing_report_of_user_on_this_video and existing_report_of_user_on_this_video.answered is False:
            raise HTTPException(status_code=403, detail=f"An unanswered report about this video has already been"
                                                        f" submitted by user with id {reporter_id}")

        return self.__add_report_in_db(reporter_id, report)

    def __add_report_in_db(self, reporter_id: int, report: ReportedVideoCreate) -> ReportedVideo:
        new_report = ReportedVideoModel(
            answered=False,
            reason=report.reason,
            reporter_id=reporter_id,
            video_id=report.video_id
        )

        try:
            self.db.add(new_report)
            self.db.commit()
            self.db.refresh(new_report)
            return new_report
        except Exception as e:
            logger.error(f"Couldn't add Reaction {new_report} to db. Reason: {e}")
            raise e
