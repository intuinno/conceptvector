FROM continuumio/anaconda:5.3.0

WORKDIR /workspace

RUN apt-get update && apt-get install -y gnupg

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g bower grunt

# RUN CWD=`ls /workspace`; echo $CWD

COPY . /workspace

RUN npm install && \
    bower install --allow-root && \
    grunt build

EXPOSE 9000