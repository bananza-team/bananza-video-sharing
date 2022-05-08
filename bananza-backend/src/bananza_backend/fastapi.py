from bananza_backend.api import users, manager_applications, auth
from bananza_backend.exceptions import *

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Bananza Backend",
    version="0.1"
)
app.include_router(users.router)
app.include_router(manager_applications.router)
app.include_router(auth.router)


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


@app.exception_handler(TokenSignatureExpired)
async def token_signature_expired_handler(request: Request, exception: TokenSignatureExpired):
    return JSONResponse(
        status_code=401,
        content={"message": "Token has expired", "details": exception.details}
    )


@app.exception_handler(InvalidToken)
async def invalid_token_handler(request: Request, exception: InvalidToken):
    return JSONResponse(
        status_code=401,
        content={"message": "Invalid token", "details": exception.details}
    )


@app.exception_handler(InvalidCredentials)
async def invalid_credentials_exception(request: Request, exception: InvalidCredentials):
    return JSONResponse(
        status_code=401,
        content={
            "message": "Invalid username or password",
            "details": exception.details,
            "headers": {"WWW-Authenticate": "Bearer"}
        }
    )


@app.exception_handler(Exception)
async def unexpected_general_handler(request: Request, exception: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": str(exception)}
    )
