from bananza_backend.db.sql_models import ManagerApplicationsModel
from bananza_backend.exceptions import EntityNotFound
from bananza_backend.services.users.repository import UserRepo

from loguru import logger
from sqlalchemy.orm import Session
from fastapi import HTTPException
from os import path


class ManagerApplicationsRepo:
    def __init__(self, database_session: Session):
        self.db = database_session
        self.folder_save_path = path.join('..', 'resources', 'cv')
        self.static_file_link = "/resources/cv/"

    async def add(self, user_id, cv_file) -> ManagerApplicationsModel:
        db_user = self.__check_user_existence(user_id)

        try:
            cv_contents = await cv_file.read()

            if not cv_contents:
                raise HTTPException(status_code=403, detail="Couldn't add manager application. No CV file given.")

            cv_generated_name = f"cv-upload-{db_user.username}"
            cv_saved_resource_path = path.join(self.folder_save_path, cv_generated_name)

            with open(cv_saved_resource_path, 'wb') as out_file:
                out_file.write(cv_contents)

        except Exception as e:
            logger.error(f"Couldn't upload CV. Reason: {e}")
            raise HTTPException(status_code=403, detail=f"Couldn't add manager application due to CV upload failure."
                                                        f" Reason: {e}")

        finally:
            await cv_file.close()

        logger.info(f"Successfully uploaded the CV to resources. Path: {cv_saved_resource_path}")

        cv_link = f"{self.static_file_link}{cv_generated_name}"

        db_user.cv_link = cv_link
        new_application = ManagerApplicationsModel(
            user=db_user,
            answered=False
        )

        try:
            self.db.add(new_application)
            self.db.commit()
            self.db.refresh(new_application)
        except Exception as e:
            logger.error(f"Couldn't add user {db_user} to db. Reason: {e}")
            raise e

        return new_application

    def get_by_id(self, application_id) -> ManagerApplicationsModel:
        found_app = self.db.query(ManagerApplicationsModel).filter(ManagerApplicationsModel.id == application_id).first()
        if not found_app:
            raise EntityNotFound(message=f"Application with id '{application_id}' not found")
        return found_app

    def __check_user_existence(self, user_id):
        user_repo = UserRepo(self.db)
        try:
            db_user = user_repo.get_by_id(user_id)
        except EntityNotFound:
            raise EntityNotFound(message=f"Application submit of user with ID {user_id} was unsuccessful",
                                 details="No user with that ID exists.")
        return db_user