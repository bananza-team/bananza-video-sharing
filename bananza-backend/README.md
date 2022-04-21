## Bananza Backend
This project's goal is a backend service for the video sharing app named Bananza, that can handle various tasks
referring the platform's users, their channels and videos.

---

### Deploying the backend project as a single container
For an easy plug-and-play setup, you have to deploy the project into a Docker container, using the Dockerfile in here.

Steps:

1. Build the image

 ````dockerfile

 cd bananza-backend

 docker build . -t bananza-backend 

 ````

  

2. Make a container out of it


 For **Linux** hosts:

 ````dockerfile

 docker run --name bananza-backend -it --network host bananza-backend

 ````

 For **Mac / Windows** hosts (mapping the 8000 port):

 ````dockerfile

 docker run --name bananza-backend -it -p 8000:8000 bananza-backend

 ````

3. Turn on the container

 ````dockerfile

 docker exec -it bananza-backend /bin/bash

 ````

-----------------

### Deploying and configuring a PostgreSQL database container

1. Pull the image 

```
docker pull postgres
```

2. Make a container out of it, mapping the 5432 port, and setting up the root user's password:

For Windows hosts:
```
docker run --name postgres-container -p 5432:5432 -e POSTGRES_PASSWORD=mypassword -d postgres
```

3. Enter the container (if this step is done right after 3. you should already be in it), use the psql script, enter the root password you just set up, and create a database named "bananza", with an "admin" user for it:
```
psql -u postgres
CREATE DATABASE bananza;
CREATE USER admin WITH PASSWORD ‘admin’; 
GRANT ALL PRIVILEGES ON bananza TO admin;
```

---

### Connecting to the database 

There are 2 options for this:
1. Using the Jetbrains **Datagrip** desktop tool, which is very promising and easy to do by entering the credentials of the database
2. Using the **pgadmin4** tool, which can be easily deployed in a Docker container on port 80, in 2 steps:
```
docker pull dpage/pgadmin4

docker run -p 80:80 \
    -e 'PGADMIN_DEFAULT_EMAIL=user@domain.com' \
    -e 'PGADMIN_DEFAULT_PASSWORD=SuperSecret' \
    -d dpage/pgadmin4
```

---

### Running database migrations

In order to use the SQLAlchemy models for creating our database tables, we'll have to use *alembic*, a tool which runs migrations for SQLAlchemy.

Here are the steps:

1. Go to the code location that adresses the db:
```
cd bananza-backend/src/bananza_backend/db/alembic
```
2. Run latest existing migrations:
```
poetry run alembic upgrade heads
```
