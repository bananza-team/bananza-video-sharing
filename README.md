
## Bananza Video Sharing

This project's goal is a video sharing app, that can handle various tasks

referring the platform's users, their channels and videos.

  

---

  

### Local deployment of backend

  

**Requirements**:

- Python (https://www.python.org/downloads/)

- Poetry (https://python-poetry.org/docs/) <br>

  

For Linux users:

```bash

curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -

```

For Windows users:

```bash

(Invoke-WebRequest -Uri https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py -UseBasicParsing).Content | python -

```

- Cloned repo

  

**Steps**

  

Being in the main repository directory:

1. cd bananza-backend/

2. poetry install

3. cd src

4. poetry run uvicorn bananza_backend.fastapi:app --host localhost --port 8000 --reload

  

---

### Local deployment of frontend

  

**Requirements**:

- npm 
	- the easiest way to install npm is by installing node-js (https://nodejs.org/en/download/). An installer for Windows and macOS is available. Linux Users can either compile the source code, or install via a package manager (https://nodejs.org/en/download/package-manager/)
	- the official npm website offers some alternatives for installing npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). I've had succes with nvm-installer on windows.

  
  

**Steps**

  

Being in the main repository directory:

1. cd bananza-frontend/

2. npm install

3. To use the developer server, run:
	```npm run dev```
	To use the production server, run:
	```npm run build```
	then
	```npm run start```
	The developer server takes less time to start up, but the production server is faster when it comes to running the application.

  

---
