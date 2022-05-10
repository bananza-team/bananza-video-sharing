from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional
from typing import Any

class UserTypeEnum(str, Enum):
    creator = "creator"
    manager = "manager"
    admin = "admin"


class UserPublic(BaseModel):
    username: Optional[str] = Field(description="Username, introduced at register")
    type: Optional[UserTypeEnum] = Field(description="Type of user, deciding his rights (creator, manager, admin)")
    description: Optional[str] = Field(description="Description which appears on the user's profile")
    profile_picture_link: Optional[str] = Field(description="Profile pic which appears on the user's profile")
    cover_picture_link: Optional[str] = Field(description="Cover picture which appears on the user's profile")
    is_active: Optional[bool] = Field(
        description="User's active status, False if he's suspended/he deleted his account")


class UserBase(UserPublic):
    email: Optional[str] = Field(description="Email, introduced at register")
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
    class Config:
        orm_mode = True

    id: Optional[int] = Field(description="Automatically generated user ID")


class ManagerApplication(BaseModel):
    class Config:
        orm_mode = True
    
    id: Optional[int] = Field(description="Automatically generated application ID")
    user: Optional[User] = Field(description="The user that submitted this application on register")
    answered: Optional[bool] = Field(description="Status of the application, answered by the admins or not.",
                                     default=False)


class Token(BaseModel):
    access_token: str
    token_type: str
