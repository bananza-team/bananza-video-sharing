from bananza_backend.db.sql_models import UserModel
from bananza_backend.models import UserCreate, UserEdit, UserTypeEnum, UserPublic, User
from bananza_backend.exceptions import EntityNotFound, EntityAlreadyExists, InvalidCredentials, FileUploadFailed, \
    ForbiddenAccess
from passlib.context import CryptContext

from loguru import logger
from sqlalchemy.orm import Session
from fastapi import File
import bcrypt
from datetime import datetime
from os import path


class UserRepo:
    def __init__(self, database_session: Session):
        self.db = database_session
        self.profile_pic_folder_path = '../resources/pictures/profile_pic'
        self.cover_pic_folder_path = '../resources/pictures/cover_pic'

    def add(self, user: UserCreate) -> UserModel:
        self.__check_user_unicity(user)

        hashed_password = self.__hash_password(user.password)

        new_user = UserModel(
            username=user.username,
            hashed_password=hashed_password,
            email=user.email,
            type=UserTypeEnum.creator,
            description=user.description,
            profile_picture_link=user.profile_picture_link,
            cover_picture_link=user.cover_picture_link,
            is_active=True,
            cv_link=user.cv_link,
            name=user.name,
            surname=user.surname,
            phone=user.phone,
        )

        try:
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
        except Exception as e:
            logger.error(f"Couldn't add user {user} to db. Reason: {e}")
            raise e

        return new_user

    def get_by_id(self, user_id: int) -> UserModel:
        found_user = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        if not found_user:
            raise EntityNotFound(message=f"User with id {user_id} not found")
        return found_user

    def get_public_by_id(self, user_id: int) -> UserPublic:
        user_with_all_info = self.get_by_id(user_id)

        if not user_with_all_info:
            raise EntityNotFound(message=f"User with id {user_id} not found")

        user_dto = UserPublic(
            username=user_with_all_info.username,
            type=user_with_all_info.type,
            description=user_with_all_info.description,
            profile_picture_link=user_with_all_info.profile_picture_link,
            cover_picture_link=user_with_all_info.cover_picture_link,
            is_active=user_with_all_info.is_active,
            videos=user_with_all_info.videos
        )

        return user_dto

    def get_by_username(self, username: str) -> UserModel:
        found_user = self.db.query(UserModel).filter(UserModel.username == username).first()
        if not found_user:
            raise EntityNotFound(message=f"User with username '{username}' not found")
        return found_user

    def get_by_email(self, email: str) -> UserModel:
        found_user = self.db.query(UserModel).filter(UserModel.email == email).first()
        if not found_user:
            raise EntityNotFound(message=f"User with email '{email}' not found")
        return found_user

    def edit(self, user: UserModel, new_user_details: UserEdit) -> UserModel:
        if not self.__verify_password(new_user_details.old_password, user.hashed_password):
            raise InvalidCredentials(details=f"The old password introduced is incorrect.")

        self.__check_user_unicity(new_user_details, excepted_user=user)

        for key, value in new_user_details:
            if hasattr(user, key):
                setattr(user, key, value)
            if key == 'new_password':
                setattr(user, 'hashed_password', self.__hash_password(new_user_details.new_password))

        self.db.commit()
        self.db.refresh(user)
        return user

    async def edit_profile_picture(self, user: UserModel, new_profile_pic: File):
        try:
            profile_pic_contents = await new_profile_pic.read()

            if not profile_pic_contents:
                raise FileUploadFailed(message="Couldn't update profile pic", details=f"No profile picture given.")

            date_right_now = datetime.now().strftime("%d-%m-%Y-%H-%M-%S")
            profile_pic_generated_name = f"profile-pic-{user.username}-{date_right_now}.jpeg"

            profile_pic_saved_path = path.join(self.profile_pic_folder_path, profile_pic_generated_name)
            with open(profile_pic_saved_path, 'wb') as out_file:
                out_file.write(profile_pic_contents)

            user.profile_picture_link = profile_pic_saved_path
            self.db.commit()
            self.db.refresh(user)
            return user

        except Exception as e:
            raise FileUploadFailed(message="Couldn't update profile pic", details=str(e))

    async def edit_cover_picture(self, user: UserModel, new_cover_pic: File):
        try:
            cover_pic_contents = await new_cover_pic.read()

            if not cover_pic_contents:
                raise FileUploadFailed(message="Couldn't update cover pic", details=f"No cover picture given.")

            date_right_now = datetime.now().strftime("%d-%m-%Y-%H-%M-%S")
            cover_pic_generated_name = f"cover-pic-{user.username}-{date_right_now}.jpeg"

            cover_pic_saved_path = path.join(self.cover_pic_folder_path, cover_pic_generated_name)
            with open(cover_pic_saved_path, 'wb') as out_file:
                out_file.write(cover_pic_contents)

            user.cover_picture_link = cover_pic_saved_path
            self.db.commit()
            self.db.refresh(user)
            return user

        except Exception as e:
            raise FileUploadFailed(message="Couldn't update cover pic", details=str(e))

    def suspend_by_id(self, user_id: int, user_that_queried: User):
        if user_that_queried.type not in [UserTypeEnum.manager, UserTypeEnum.admin]:
            raise ForbiddenAccess(message="Access denied to suspend users",
                                  details=f"User with id {user_that_queried.id} is not a manager or admin")

        user_to_be_suspended = self.get_by_id(user_id)

        if user_to_be_suspended.type in [UserTypeEnum.manager, UserTypeEnum.admin]:
            if user_that_queried.type != UserTypeEnum.admin:
                raise ForbiddenAccess(message=f"Access denied to suspend manager with ID {user_id}",
                                      details=f"Only an admin can suspend managers or other admins")

        user_to_be_suspended.is_active = False

        logger.info(f"Manager with ID {user_that_queried.id}, '{user_that_queried.username}', "
                    f"type {user_that_queried.type} issued"
                    f" a suspension on user with ID {user_to_be_suspended.id}, '{user_to_be_suspended.username}',"
                    f"type {user_to_be_suspended.type}.")

        self.db.commit()
        self.db.refresh(user_to_be_suspended)
        return user_to_be_suspended

    def __hash_password(self, plain_text_password: str):
        bytecode_password = plain_text_password.encode('UTF-8')
        hashed_password = bcrypt.hashpw(
            bytecode_password,
            bcrypt.gensalt()
        )
        return hashed_password

    def __verify_password(self, plain_password, hashed_password):
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.verify(plain_password, hashed_password)

    def __check_user_unicity(self, user, excepted_user: UserModel = None):
        if excepted_user:
            if excepted_user.username != user.username:
                self.__check_username_unicity(user.username)
            if excepted_user.email != user.email:
                self.__check_email_unicity(user.email)
            return

        self.__check_username_unicity(user.username)
        self.__check_email_unicity(user.email)

    def __check_email_unicity(self, email:str):
        try:
            user_with_same_email = self.get_by_email(email)
            raise EntityAlreadyExists(message=f"User with email {email} already exists")
        except EntityNotFound:
            pass

    def __check_username_unicity(self, username):
        try:
            user_with_same_username = self.get_by_username(username)
            raise EntityAlreadyExists(message=f"User with username {username} already exists")
        except EntityNotFound:
            pass

