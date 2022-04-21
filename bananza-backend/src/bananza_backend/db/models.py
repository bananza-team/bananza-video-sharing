from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


BaseModel = declarative_base()


class User(BaseModel):
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
    channel_id = Column(
        Integer,
        ForeignKey("channels.id"),
        nullable=False
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )
    cv_link = Column(String, nullable=True)
    name = Column(String, nullable=True)
    surname = Column(String, nullable=True)
    phone = Column(String, nullable=True)

