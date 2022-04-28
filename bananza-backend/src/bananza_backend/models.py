from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional


class UserTypeEnum(str, Enum):
    creator = "creator"
    manager = "manager"
    admin = "admin"


class UserBase(BaseModel):
    username: Optional[str] = Field(description="Username, introduced at register")
    email: Optional[str] = Field(description="Email, introduced at register")
    type: Optional[UserTypeEnum] = Field(description="Type of user, deciding his rights (creator, manager, admin)")
    description: Optional[str] = Field(description="Description which appears on the user's profile")
    profile_picture_link: Optional[str] = Field(description="Profile pic which appears on the user's profile")
    cover_picture_link: Optional[str] = Field(description="Cover picture which appears on the user's profile")
    is_active: Optional[bool] = Field(description="User's active status, False if he's suspended/he deleted his account")
    cv_link: Optional[str] = Field(description="CV link, existent only if user applies for management position",
                                   default="")
    name: Optional[str] = Field(description="Name, existent only if user applies for management position", default="")
    surname: Optional[str] = Field(description="Surname, existent only if user applies for management position",
                                   default="")
    phone: Optional[str] = Field(description="Phone number, existent only if user applies for management position",
                                 default="")


class UserCreate(UserBase):
    password: Optional[str] = Field(description="Password, introduced at register, unhashed")


class User(UserBase):
    id: Optional[int] = Field(description="Automatically generated user ID")

    class Config:
        orm_mode = True
