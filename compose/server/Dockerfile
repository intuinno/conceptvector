FROM continuumio/anaconda:5.3.0

WORKDIR /data

RUN pip install flask flask-migrate flask-bcrypt \
    flask-restful flask-cors marshmallow ipdb psycopg2 flask-sqlalchemy Flask-Script

RUN apt install -y unzip wget

RUN mkdir data && \
    cd data && \
    wget http://nlp.stanford.edu/data/glove.6B.zip && \
    unzip glove.6B.zip

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /
RUN chmod +x /wait-for-it.sh

WORKDIR /workspace

EXPOSE 5000