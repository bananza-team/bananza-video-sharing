from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional


class UserTypeEnum(str, Enum):
    creator = "creator"
    manager = "manager"
    admin = "admin"


class UserCreateSchema(BaseModel):
    username: Optional[str] = Field(description="Username, introduced at register")
    email: Optional[str] = Field(description="Email, introduced at register")
    password: Optional[str] = Field(description="Password, introduced at register and hashed")
    cv_link: Optional[str] = Field(description="CV link, existent only if user applies for management position", default="")
    name: Optional[str] = Field(description="Name, existent only if user applies for management position", default="")
    surname: Optional[str] = Field(description="Surname, existent only if user applies for management position", default="")
    phone: Optional[str] = Field(description="Phone number, existent only if user applies for management position", default="")

    class Config:
        orm_mode = True


class UserSchema(UserCreateSchema):
    id: Optional[int] = Field(description="Automatically generated user ID")
    type: Optional[UserTypeEnum] = Field(description="Type of user, deciding his rights (creator, manager, admin)")
    channel_id: Optional[int] = Field(description="Channel associated with the user, created at register")
    is_active: Optional[bool] = Field(description="User's active status, False if he's suspended/he deleted his account")

