## Bananza Backend
This project's goal is a backend service for the video sharing app named Bananza, that can handle various tasks
referring the platform's users, their channels and videos.

We'll use _Poetry_ as a package and environment manager.

---

### Local deployment
1. Clone the repo
2. cd bananza-video-sharing/bananza-backend/
3. poetry install
4. cd src
5. poetry run uvicorn bananza_backend.fastapi:app --host localhost --port 8000 --reload

---

### Deploying the backend project as a single container
For an easy plug-and-play setup, you have to deploy the project into a Docker container, using the Dockerfile in here.

Steps:

1. Build the image

 ````dockerfile

 cd bananza-backend

 docker build . -t bananza-backend

 ````



2. Make a container out of it


 For **Linux** hosts:

 ````dockerfile

 docker run --name bananza-backend -it --network host bananza-backend

 ````

 For **Mac / Windows** hosts (mapping the 8000 port):

 ````dockerfile

 docker run --name bananza-backend -it -p 8000:8000 bananza-backend

 ````

3. Turn on the container

 ````dockerfile

 docker exec -it bananza-backend /bin/bash

 ````
---

### Creating an automatic migration based on existing models

In order to use the SQLAlchemy models for creating our database tables, we'll have to use *alembic*,
a tool which manages migrations for SQLAlchemy, using the SQLite database.

Steps for **creating** a migration based on existing models:

1. Go to the code location that contains the alembic scripts, migrations and the sqlite db:
```
cd bananza-backend/src/bananza_backend/db/alembic
```
2. Run latest existing migrations:
```
poetry run alembic revision --autogenerate -m "<Migration name>"
```

---

### Running database migrations

In order to change the database structure using SQLAlchemy, we need to run the created migrations.
For that, we'll also use Alembic.

Here are the steps for running (applying) the latest migration:

1. Go to the code location that adresses the db:
```
cd bananza-backend/src/bananza_backend/db/alembic
```
2. Run latest existing migrations:
```
poetry run alembic upgrade heads
```



