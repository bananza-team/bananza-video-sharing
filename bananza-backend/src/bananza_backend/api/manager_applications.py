from bananza_backend.models import ManagerApplication
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.manager_applications.repository import ManagerApplicationsRepo

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/application", tags=["Manager applications"])


@router.post("/{user_id}", summary="Register a user to the db, by his id", response_model=ManagerApplication)
async def submit_user_application(user_id: str, db: Session = Depends(get_db)):
    applications_repo = ManagerApplicationsRepo(db)
    new_application = applications_repo.add(user_id=user_id)
    return new_application


@router.get("/{application_id}", summary="Get a user application from the db", response_model=ManagerApplication)
async def get_user_application(application_id: str, db: Session = Depends(get_db)):
    applications_repo = ManagerApplicationsRepo(db)
    new_application = applications_repo.get_by_id(application_id=application_id)
    return new_application
