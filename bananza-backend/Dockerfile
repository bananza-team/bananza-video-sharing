FROM ubuntu:latest

RUN apt-get update -y
RUN apt-get install curl python3.9 python3-distutils bash vim rsync -y
RUN apt-get install python3-pip -y
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 1
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3 -

RUN mkdir -p /home/bananza-backend
WORKDIR /home/bananza-backend

# Take the files from repo to the container
COPY . /home/bananza-backend/

# Install the dependencies
RUN /root/.poetry/bin/poetry install

# Expose application port
EXPOSE 8000

CMD ["cd", "src"]
# start the server
CMD ["/root/.poetry/bin/poetry", "run", "uvicorn", "bananza_backend.fastapi:app", "--host", "0", "--port", "8000", "--reload"]
