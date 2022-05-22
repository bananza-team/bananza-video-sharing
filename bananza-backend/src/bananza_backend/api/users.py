from bananza_backend.models import UserCreate, User, UserPublic, UserEdit
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.users.repository import UserRepo
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme

from fastapi import APIRouter, Depends, UploadFile, File
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


@router.patch("/suspend/{user_id}", summary="Get user by ID", response_model=User)
async def suspend_user(user_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    return UserRepo(db).suspend_by_id(user_id, user_that_queried=current_user)


@router.patch("/current/info", summary="Edit current user's info", response_model=User)
async def edit_current_user(new_details: UserEdit, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    return UserRepo(db).edit(current_user, new_details)


@router.patch("/current/profile_picture", summary="Edit current user's profile picture", response_model=User)
async def edit_current_user_profile_pic(profile_pic: UploadFile = File(...), db: Session = Depends(get_db),
                                        token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    updated_user = await UserRepo(db).edit_profile_picture(current_user, profile_pic)
    return updated_user


@router.patch("/current/cover_picture", summary="Edit current user's cover picture", response_model=User)
async def edit_current_user_cover_pic(cover_pic: UploadFile = File(...), db: Session = Depends(get_db),
                                      token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    updated_user = await UserRepo(db).edit_cover_picture(current_user, cover_pic)
    return updated_user
