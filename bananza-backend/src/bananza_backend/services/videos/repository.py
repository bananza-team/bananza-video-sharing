import uuid
from datetime import datetime
from typing import List

from bananza_backend.db.sql_models import VideoModel
from bananza_backend.exceptions import FileUploadFailed, EntityNotFound, ForbiddenAccess
from bananza_backend.models import VideoCreate, Video, VideoForSearch, User, UserTypeEnum

from loguru import logger
from sqlalchemy.orm import Session
from os import path
from fastapi import File, HTTPException


class VideoRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

    async def add(self, owner_id, video_file: File, thumbnail_file: File, details=VideoCreate) -> VideoModel:
        date_right_now = datetime.now().strftime("%d-%m-%Y-%H-%M-%S")
        unique_id = f"{date_right_now}-{uuid.uuid4()}"

        static_video_link = await self.__upload_generic_file_on_disk(
            file=video_file,
            file_type="video",
            folder_save_path=path.join('..', 'resources', 'video'),
            extension="mp4",
            random_identifier=unique_id,
            general_static_file_link="/resources/video/"
        )
        static_thumbnail_link = await self.__upload_generic_file_on_disk(
            file=thumbnail_file,
            file_type="thumbnail",
            folder_save_path=path.join('..', 'resources', 'thumbnail'),
            extension="jpeg",
            random_identifier=unique_id,
            general_static_file_link="/resources/thumbnail/"
        )

        new_video = VideoModel(
            owner_id=owner_id,
            title=details.title,
            description=details.description,
            resource_link=static_video_link,
            thumbnail_image_link=static_thumbnail_link
        )

        try:
            self.db.add(new_video)
            self.db.commit()
            self.db.refresh(new_video)
        except Exception as e:
            logger.error(f"Couldn't add user {new_video} to db. Reason: {e}")
            raise e

        return new_video

    async def get_all(self) -> List[VideoForSearch]:
        return self.db.query(VideoModel).all()

    async def get_by_id(self, video_id: int) -> VideoModel:
        found_video = self.db.query(VideoModel).filter(VideoModel.id == video_id).first()
        if not found_video:
            raise EntityNotFound(message=f"Video with id {video_id} not found")
        return found_video

    async def edit_details(self, video_id: int, user_that_edits: User, new_details: VideoCreate):
        found_video = await self.get_by_id(video_id)

        if not found_video.owner_id == user_that_edits.id:
            raise ForbiddenAccess(message=f"Couldn't edit video {video_id}",
                                  details=f"User with id {user_that_edits.id} doesn't own video with id {video_id}")

        found_video.title = new_details.title
        found_video.description = new_details.description
        self.db.commit()
        self.db.refresh(found_video)

        return found_video

    async def delete(self, video_id: int, user_that_deletes: User):
        found_video = await self.get_by_id(video_id)

        deleter_id = user_that_deletes.id
        deleter_type = user_that_deletes.type

        if not found_video.owner_id == deleter_id:
            if not (deleter_type == UserTypeEnum.manager or deleter_type == UserTypeEnum.admin):
                raise ForbiddenAccess(message=f"Couldn't delete video {video_id}",
                                      details=f"User with id {deleter_id} doesn't own video with id {video_id}")

        try:
            self.db.delete(found_video)
            self.db.commit()
            logger.info(f"Video with id {video_id} has been successfully deleted")
        except Exception as e:
            logger.error(f"Couldn't delete video with id {video_id}. Reason: {e}")
            raise HTTPException(status_code=403, detail=f"Couldn't delete video.")

    async def __upload_generic_file_on_disk(self, file: File, file_type: str, extension: str,
                                            folder_save_path, random_identifier: str, general_static_file_link: str):
        try:
            file_contents = await file.read()

            if not file_contents:
                raise FileUploadFailed(message=f"Couldn't upload {file_type}",
                                       details=f"No {file_type} file given")

            file_generated_name = f"{file_type}-{random_identifier}.{extension}"

            file_saved_path = path.join(folder_save_path, file_generated_name)
            with open(file_saved_path, 'wb') as file_out:
                file_out.write(file_contents)

            logger.info(f"Successfully uploaded a {file_type} to resources. Path: {file_saved_path}")

            return f"{general_static_file_link}{file_generated_name}"

        # TODO: the files on an entry should be deleted if the entry was invalidated and didn't go to db
        except Exception as e:
            raise FileUploadFailed(message=f"Couldn't upload {file_type}", details=str(e))
