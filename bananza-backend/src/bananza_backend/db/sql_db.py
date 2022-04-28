from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging

SQLALCHEMY_DATABASE_URL = f"sqlite:///alembic/models.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logging.error(f"Couldn't load the database. Details: {e}")
    finally:
        db.close()
