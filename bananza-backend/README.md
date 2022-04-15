### Bananza Backend
This project's goal is a backend service for the video sharing app named Bananza, that can handle various tasks
referring the platform's users, their channels and videos.

---

Deploying this project as a single container:

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