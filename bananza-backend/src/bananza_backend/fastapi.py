from fastapi import FastAPI
from fastapi.responses import JSONResponse
from bananza_backend.api import users, manager_applications
from bananza_backend.exceptions import *
from requests import Request

app = FastAPI(
    title="Bananza Backend",
    version="0.1"
)
app.include_router(users.router)
app.include_router(manager_applications.router)


@app.exception_handler(EntityNotFound)
async def entity_not_found_exception_handler(request: Request, exception: EntityNotFound):
    return JSONResponse(
        status_code=404,
        content={"message": str(exception), "details": exception.details}
    )


@app.exception_handler(EntityAlreadyExists)
async def entity_already_exists_handler(request: Request, exception: EntityAlreadyExists):
    return JSONResponse(
        status_code=409,
        content={"message": str(exception), "details": exception.details}
    )


@app.exception_handler(Exception)
async def unexpected_general_handler(request: Request, exception: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": str(exception)}
    )

