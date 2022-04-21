from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging

POSTGRES_USER = "admin"
POSTGRES_PASS = "admin"
POSTGRES_HOST = "localhost"
POSTGRES_DB = "bananza"

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASS}@{POSTGRES_HOST}/{POSTGRES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logging.error(f"Couldn't load the database. Details: {e}")
        db.close()
