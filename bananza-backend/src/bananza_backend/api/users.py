from bananza_backend.models import UserCreate, User
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.users.repository import UserRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/user", tags=["User management"])


@router.post("/", summary="Register a user to the db", response_model=User)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    user_repo = UserRepo(db)
    new_user = user_repo.add(user)
    return new_user



@router.get("/current", summary="Get current user based on JWT token", response_model=User)
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    auth_handler = AuthHandler(db)
    user = auth_handler.get_current_user_by_token(token)
    return user

