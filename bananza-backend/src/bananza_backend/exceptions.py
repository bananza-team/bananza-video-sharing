from loguru import logger


class GeneralException(Exception):
    def __init__(self, message="", details=""):
        self.message = message
        self.details = details
        super().__init__(self.message)
        logger.error(f"{self.message}. Details: {details if details else 'none'}")


class EntityNotFound(GeneralException):
    pass


class EntityAlreadyExists(GeneralException):
    pass


class TokenSignatureExpired(GeneralException):
    pass


class InvalidToken(GeneralException):
    pass


class InvalidCredentials(GeneralException):
    pass


class InactiveUser(GeneralException):
    pass