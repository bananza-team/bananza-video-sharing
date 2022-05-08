from bananza_backend.models import UserCreate, User
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.users.repository import UserRepo

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/user", tags=["User management"])


@router.post("/", summary="Register a user to the db", response_model=User)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    user_repo = UserRepo(db)
    new_user = user_repo.add(user)
    return new_user
