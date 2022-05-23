from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from bananza_backend.db.sql_models import BaseModel
from bananza_backend.db.sql_db import get_db
from bananza_backend.fastapi import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


BaseModel.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_register_inexistent_user_succeeds():
    response = client.post(
        "/user/",
        json={{
            "username": "alex",
            "type": "creator",
            "description": "string",
            "profile_picture_link": "string",
            "cover_picture_link": "string",
            "is_active": True,
            "videos": [],
            "email": "email@email.com",
            "cv_link": "",
            "name": "",
            "surname": "",
            "phone": "",
            "password": "alex"
        }},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["username"] == "serbanlex"
    assert data["email"] == "email@email.com"
    assert data["is_active"] is True


def test_get_existend_user_succeeds():
    response = client.get(
        "/user/1",
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["username"] == "serbanlex"
    assert data["email"] == "email@email.com"
    assert data["is_active"] is True


