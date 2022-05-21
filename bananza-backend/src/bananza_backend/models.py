from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional
from datetime import datetime


class CommentPoster(BaseModel):
    id: Optional[int] = Field(description="Id of the user that left the comment")
    username: Optional[str] = Field(description="Username of the user that left the comment, displayed on it")
    profile_picture_link: Optional[str] = Field(description="Profile pic which will be shown in comment")

    class Config:
        orm_mode = True


class CommentCreate(BaseModel):
    content: Optional[str] = Field(description="Content of the comment made by the user")
    video_id: Optional[int] = Field(description="ID of the video containing the comment")


class Comment(CommentCreate):
    id: Optional[int] = Field(description="Automatically generated comment ID")
    user_id: Optional[int] = Field(description="ID of the user that left this comment")
    user: Optional[CommentPoster] = Field(description="User that left this comment")

    class Config:
        orm_mode = True


class VideoCreate(BaseModel):
    title: Optional[str] = Field(description="Title of the video",
                                 default=f"Video upload {datetime.now().strftime('%d-%m-%Y-%H-%M-%S')}")
    description: Optional[str] = Field(description="Description of the video")


class VideoForSearch(VideoCreate):
    class Config:
        orm_mode = True
    owner_id: Optional[int] = Field(description="ID of the user owning this video")
    id: Optional[int] = Field(description="Automatically generated video ID")
    resource_link: Optional[str] = Field(description="Link of the video, automatically generated upon upload")
    thumbnail_image_link: Optional[str] = Field(description="Thumbnail of the video, uploaded by user")


class Video(VideoForSearch):
    comments: Optional[List[Comment]] = Field(description="All the comments")


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
    is_active: Optional[bool] = Field(description="User's active status, False if he's suspended/deleted")
    videos: Optional[List[Video]] = Field(description="Videos owned by user", default=[])


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


class UserEdit(BaseModel):
    username: Optional[str] = Field(description="New username that the user wants, has to be unique")
    email: Optional[str] = Field(description="New unused email that the user wants")
    description: Optional[str] = Field(description="A new description for the user's profile")
    name: Optional[str] = Field(description="Name of the manager, that he wishes to change")
    surname: Optional[str] = Field(description="Surname of the manager, that he wishes to change")
    phone: Optional[str] = Field(description="Phone number that the manager wishes to change")
    new_password: Optional[str] = Field(description="New password that the user wishes to have")
    old_password: Optional[str] = Field(description="Old password of the user, used to validate the change")


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


class ReactionStateEnum(str, Enum):
    like = "like"
    neutral = "neutral"
    dislike = "dislike"


class ReactionCreate(BaseModel):
    state: Optional[ReactionStateEnum] = Field(description="Reaction state gave by the user")
    video_id: Optional[int] = Field(description="ID of the video that holds this reaction")


class Reaction(ReactionCreate):
    id: Optional[int] = Field(description="Automatically generated reaction ID")
    user_id: Optional[int] = Field(description="ID of the user that owns this reaction")

    class Config:
        orm_mode = True


class VideoReactionCount(BaseModel):
    class Config:
        orm_mode = True
    likes: int = Field(description="Number of video likes, computed from the db")
    dislikes: int = Field(description="Number of video likes, computed from the db")
    current_user_reaction: ReactionStateEnum = Field(description="Reaction of current user")


class ReporterUser(BaseModel):
    class Config:
        orm_mode = True
    id: Optional[int] = Field(description="ID of the reporter")
    username: Optional[str] = Field(description="Username of the reporter")
    profile_picture_link: Optional[str] = Field(description="Profile pic of the reporter")
    cover_picture_link: Optional[str] = Field(description="Cover picture of the reporter")


class ReportedVideoCreate(BaseModel):
    reason: Optional[str] = Field(description="Reason for reporting the video")
    video_id: Optional[int] = Field(description="ID of the reported video")


class ReportedVideo(ReportedVideoCreate):
    class Config:
        orm_mode = True
    id: Optional[int] = Field(description="Automatically generated ID of the reported video")
    answered: Optional[bool] = Field(description="Answered state of the report", default=False)

    reporter_id: Optional[int] = Field(description="ID of the user that reported the video")
    video: Optional[VideoForSearch] = Field(description="Video object of the video that is reported")
    reporter: Optional[ReporterUser] = Field(description="User object of the user that reported the video")
