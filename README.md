## Bananza Video Sharing
This project's goal is a video sharing app, that can handle various tasks
referring the platform's users, their channels and videos.

---

### Local deployment of backend

**Requirements**:
- Python
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
- npm ([https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm"))


**Steps**

Being in the main repository directory:
1. cd bananza-frontend/
2. npm install
3. npm run build
4. npm run start

---
