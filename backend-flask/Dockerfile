FROM python:3.10-slim-buster

#container entry point
WORKDIR /backend-flask

#copy from outside container into the container
#contains the libraries we need
COPY requirements.txt requirements.txt

#install the requirements specified into the container
RUN pip3 install -r requirements.txt

# . . means everything outside copied inside the container
COPY . .

#set the environemnt variable inside container
ENV FLASK_ENV=development

#
EXPOSE ${PORT}

#this starts the flask server
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]