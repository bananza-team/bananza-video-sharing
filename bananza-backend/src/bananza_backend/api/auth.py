from bananza_backend.models import Token
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.authentication.handler import AuthHandler

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth_handler = AuthHandler(db)
    access_token = auth_handler.authenticate_user_for_token(form_data.username, form_data.password)
    return {"access_token": access_token, "token_type": "bearer"}