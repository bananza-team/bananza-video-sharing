from pydantic import BaseModel, Field
from enum import Enum
from typing import List


class UserTypeEnum(str, Enum):
    creator = "creator"
    manager = "manager"
    admin = "admin"


class UserBase(BaseModel):
    id: int = Field()
    username: str = Field()
    email: str = Field()
    type: UserTypeEnum = Field()
    channel_id: int = Field()

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    hashed_password: str = Field()
    is_active: bool = Field()
    cv_link: str = Field()
    name: str = Field()
    surname: str = Field()
    phone: str = Field()

