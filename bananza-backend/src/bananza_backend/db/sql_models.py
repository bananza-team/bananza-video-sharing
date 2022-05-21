from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


BaseModel = declarative_base()


class UserModel(BaseModel):
    __tablename__ = "users"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )
    username = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )
    hashed_password = Column(
        String,
        nullable=False
    )
    email = Column(
        String,
        unique=True,
        nullable=False
    )
    type = Column(
        Enum(
            "creator",
            "manager",
            "admin",
            name="user_type_enum",
            create_type=False
        ),
        default="creator",
        index=True,
        nullable=False
    )
    description = Column(
        String,
        nullable=True
    )
    profile_picture_link = Column(
        String,
        nullable=True
    )
    cover_picture_link = Column(
        String,
        nullable=True
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )
    cv_link = Column(
        String,
        nullable=True
    )
    name = Column(
        String,
        nullable=True)
    surname = Column(
        String,
        nullable=True)
    phone = Column(
        String,
        nullable=True)
    videos = relationship(
        "VideoModel",
        back_populates="owner"
    )
    manager_application = relationship(
        "ManagerApplicationsModel",
        back_populates="user",
        uselist=False
    )
    comments = relationship(
        "CommentModel",
        back_populates="user"
    )
    reactions = relationship(
        "ReactionModel",
        back_populates="user"
    )
    reports = relationship(
        "ReportedVideoModel",
        back_populates="reporter"
    )


class VideoModel(BaseModel):
    __tablename__ = "videos"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )
    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    owner = relationship(
        "UserModel",
        back_populates="videos"
    )
    title = Column(
        String,
        nullable=False
    )
    description = Column(
        String,
        nullable=True
    )
    resource_link = Column(
        String,
        nullable=False
    )
    thumbnail_image_link = Column(
        String,
        nullable=False
    )
    comments = relationship(
        "CommentModel",
        back_populates="video"
    )
    reactions = relationship(
        "ReactionModel",
        back_populates="video"
    )
    reports = relationship(
        "ReportedVideoModel",
        back_populates="video"
    )


class CommentModel(BaseModel):
    __tablename__ = "comments"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )
    video_id = Column(
        Integer,
        ForeignKey("videos.id")
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    video = relationship(
        "VideoModel",
        back_populates="comments"
    )
    user = relationship(
        "UserModel",
        back_populates="comments"
    )
    content = Column(
        String,
        nullable=False
    )


class ReactionModel(BaseModel):
    __tablename__ = "reactions"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )
    video_id = Column(
        Integer,
        ForeignKey("videos.id")
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    video = relationship(
        "VideoModel",
        back_populates="reactions"
    )
    user = relationship(
        "UserModel",
        back_populates="reactions"
    )

    state = Column(
        Enum(
            "like",
            "neutral",
            "dislike",
            name="reaction_state_enum",
            create_type=False
        ),
        default="neutral",
        index=True,
        nullable=False
    )


class ManagerApplicationsModel(BaseModel):
    __tablename__ = "managementApplications"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )
    answered = Column(
        Boolean,
        index=True,
        default=False
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    user = relationship(
        "UserModel",
        back_populates="manager_application"
    )


class ReportedVideoModel(BaseModel):
    __tablename__ = "reportedVideos"
    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )
    answered = Column(
        Boolean,
        index=True,
        default=False
    )
    reporter_id = Column(
        Integer,
        ForeignKey("users.id")
    )
    reporter = relationship(
        "UserModel",
        back_populates="reports"
    )
    video_id = Column(
        Integer,
        ForeignKey("videos.id")
    )
    video = relationship(
        "VideoModel",
        back_populates="reports"
    )
    reason = Column(
        String,
        nullable=False
    )

