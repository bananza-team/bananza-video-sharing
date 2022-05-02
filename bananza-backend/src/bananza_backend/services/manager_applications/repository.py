from bananza_backend.db.sql_models import ManagerApplicationsModel
from bananza_backend.exceptions import EntityNotFound
from bananza_backend.services.users.repository import UserRepo

from loguru import logger
from sqlalchemy.orm import Session


class ManagerApplicationsRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

    def add(self, user_id) -> ManagerApplicationsModel:
        db_user = self.__check_user_existence(user_id)

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

