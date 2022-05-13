from bananza_backend.models import UserCreate, User, UserPublic, UserEdit
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.users.repository import UserRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/user", tags=["User management"])


@router.post("/", summary="Register a user to the db", response_model=User)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = UserRepo(db).add(user)
    return new_user


@router.get("/current", summary="Get current user based on JWT token", response_model=User)
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = AuthHandler(db).get_current_user_by_token(token)
    return user


@router.get("/{user_id}", summary="Get user by ID", response_model=UserPublic)
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    return UserRepo(db).get_public_by_id(user_id)


@router.patch("/current/info", summary="Edit user by ID", response_model=User)
async def edit_current_user(new_details: UserEdit, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user = AuthHandler(db).get_current_user_by_token(token)
    return UserRepo(db).edit(user, new_details)
