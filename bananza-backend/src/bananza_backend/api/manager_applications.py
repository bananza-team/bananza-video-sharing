from bananza_backend.models import ManagerApplication
from bananza_backend.db.sql_db import get_db
from bananza_backend.services.authentication.handler import AuthHandler, oauth2_scheme
from bananza_backend.services.manager_applications.repository import ManagerApplicationsRepo

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/application", tags=["Manager applications"])


@router.post("/{user_id}", summary="Register a user to the db, by his id", response_model=ManagerApplication)
async def submit_user_application(user_id: int, cv_file: UploadFile = File(...), db: Session = Depends(get_db)):
    applications_repo = ManagerApplicationsRepo(db)
    new_application = await applications_repo.add(user_id=user_id, cv_file=cv_file)

    return new_application


@router.post("/{application_id}/accept", summary="Accept a manager application", response_model=ManagerApplication)
async def accept_user_application(application_id: int, db: Session = Depends(get_db),
                                  token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    new_application = ManagerApplicationsRepo(db).answer_application(application_id, current_user, accepted=True)

    return new_application


@router.post("/{application_id}/deny", summary="Reject a manager application", response_model=ManagerApplication)
async def reject_user_application(application_id: int, db: Session = Depends(get_db),
                                  token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    new_application = ManagerApplicationsRepo(db).answer_application(application_id, current_user, accepted=False)

    return new_application


@router.get("/all", summary="Get a user application from the db", response_model=List[ManagerApplication])
async def get_all_mananger_applications(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = AuthHandler(db).get_current_user_by_token(token)
    return ManagerApplicationsRepo(db).get_all(user_that_queried=current_user)
