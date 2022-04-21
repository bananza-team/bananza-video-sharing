from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from bananza_backend.models import UserCreate

router = APIRouter(prefix="/user", tags=["user"])


@router.get("", summary="")
async def register_user(user_info: UserCreate):
    pass
