from bananza_backend.db.sql_models import UserModel
from bananza_backend.models import UserCreate, UserEdit, UserTypeEnum
from bananza_backend.exceptions import EntityNotFound, EntityAlreadyExists, InvalidCredentials
from passlib.context import CryptContext

from loguru import logger
from sqlalchemy.orm import Session
import bcrypt


class UserRepo:
    def __init__(self, database_session: Session):
        self.db = database_session

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

    def get_public_by_id(self, user_id: int) -> UserModel:
        found_user = self.db.query(UserModel).with_entities(
            UserModel.id,
            UserModel.username,
            UserModel.type,
            UserModel.description,
            UserModel.profile_picture_link,
            UserModel.cover_picture_link,
            UserModel.is_active
        ).filter(UserModel.id == user_id).first()
        if not found_user:
            raise EntityNotFound(message=f"User with id {user_id} not found")
        return found_user

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

    def get_all(self):
        pass

    def delete_by_id(self):
        pass

    def suspend_by_id(self):
        pass

    def unsuspend_by_id(self):
        pass

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

