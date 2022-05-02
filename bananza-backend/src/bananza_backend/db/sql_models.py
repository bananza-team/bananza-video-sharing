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