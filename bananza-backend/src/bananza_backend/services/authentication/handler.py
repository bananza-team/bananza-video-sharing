from fastapi.security import OAuth2PasswordBearer

from bananza_backend.db.sql_models import UserModel
from bananza_backend.services.users.repository import UserRepo
from bananza_backend.exceptions import TokenSignatureExpired, InvalidToken, GeneralException, EntityNotFound, \
    InvalidCredentials, InactiveUser

from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from loguru import logger


SECRET_KEY = "dc48c4144d1efa9ddbf1ac3d1a6c57eef20aadef8902cde78cde16c6f457e41a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 45

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class AuthHandler:
    def __init__(self, database_session: Session):
        self.users_repo = UserRepo(database_session)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def get_current_user_by_token(self, token: str) -> UserModel:
        token_data = AuthHandler.decode_user_token(token)
        user_id: int = token_data['id']

        try:
            user = self.users_repo.get_by_id(user_id)
        except EntityNotFound as e:
            raise InvalidCredentials(details=e)

        return user

    def authenticate_user_for_token(self, username, password):
        user = self.__validate_user(username, password)

        try:
            jwt_token = AuthHandler.encode_user_token(user)
        except Exception as e:
            raise GeneralException(message=e)

        return jwt_token

    def __validate_user(self, username: str, password: str):
        try:
            user = self.users_repo.get_by_username(username)
        except EntityNotFound:
            raise InvalidCredentials(message=f"Login with username {username} failed")

        if not self.__verify_password(password, user.hashed_password):
            raise InvalidCredentials(message=f"Login with username {username} failed")

        if not user.is_active:
            raise InactiveUser(message=f"Login with username {username} failed",
                               details=f"User '{username}' is suspended/inactive.")

        return user

    def __verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    @classmethod
    def encode_user_token(cls, user: UserModel):
        expiration_time = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {
            'exp': expiration_time,
            'iat': datetime.utcnow(),
            'sub': user.username,
            'id': user.id,
            'type': user.type,
            'profile_pic': user.profile_picture_link
        }
        try:
            encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        except Exception as e:
            logger.error(f"Couldn't encode JWT of user {user.username}. Details: ")
            raise e

        return encoded_jwt

    @classmethod
    def decode_user_token(cls, token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload['sub']
            if not username:
                raise InvalidCredentials
            return payload
        except jwt.ExpiredSignatureError as e:
            raise TokenSignatureExpired(details=str(e))
        except jwt.JWTError as e:
            logger.error("Error decoding JWT Token.")
            raise InvalidToken(details=str(e))