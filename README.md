# Conceptvector

## Setting up the environment

#### 1. Install `Anaconda`

- Download the latest distribution

    ``` 
    wget https://repo.continuum.io/archive/Anaconda2-5.3.0-Linux-x86_64.sh 
    ```

- Execute the script

    ```
    bash Anaconda2-5.3.0-Linux-x86_64.sh
    ```

#### 2. Create a custom environment

- Create a conda environment 'conceptvector'
    ```
    conda create -n conceptvector python=2.7 anaconda
    ```
- Activate the conda environment
    ```
    source activate conceptvector
    ```

#### 3. Install `uwsgi`
```
conda install -c travis uwsgi
```

#### 4. Install `flask`
```
conda install -c https://conda.anaconda.org/anaconda flask
```

#### 5. Cloning the source code
```
git clone https://github.com/intuinno/conceptvector.git
```

#### 6. Install `npm`, `bower` & `grunt`
```
sudo apt install npm
sudo  npm install -g bower
sudo  npm install -g grunt
```

## Setting up the client

- Change the directory to `conceptvector/client` 
- Build client
    ```
    npm install
    bower install
    grunt build
    ```
- Run client
    ```
    grunt serve
    ```

## Setting up the server

1. Activate conceptvector environment
    ```
    source activate conceptvector
    ```
2. Install dependencies
    - Install `flask-migrate`, `flask-bcrypt`, `flask-restful`, `flask-cors`, `marshmallow`, `ipdb`, `psycopg2`, `flask-sqlalchemy`
        ```
        conda install -c conda-forge flask-migrate flask-bcrypt flask-restful flask-cors marshmallow ipdb psycopg2 flask-sqlalchemy
        ```
    - Install `flask-script`
        ```
        pip install Flask-Script
        ```

3. Setting up environment variables
    - Create the following files
        ```
        cd ~/anaconda2/envs/conceptvector/
        mkdir -p ./etc/conda/activate.d
        mkdir -p ./etc/conda/deactivate.d
    
        touch ./etc/conda/activate.d/env_vars.sh
        touch ./etc/conda/deactivate.d/env_vars.sh
        ```

    - Add the following content to both the files (`env_vars.sh`)
        ```
        export APP_SETTINGS=config.DevelopmentConfig
        export DATABASE_URL=postgresql://postgres:postgres@localhost/conceptvectorDB
        ```

4. Download & unzip stanford **glove** dataset
    - Change the directory to `conceptvector/server`
    ```
    mkdir data
    cd data
    wget http://nlp.stanford.edu/data/glove.6B.zip
    unzip glove.6B.zip
    ```

5. Set up database
    - Install `PostgreSQL` database
        ```
        sudo apt install postgresql postgresql-contrib
        ```
    - Start the databse service
        ```
        sudo service postgresql start
        ```
    - Create a database `conceptvectorDB` using the default user `postgres`
        ```
        sudo -u postgres createdb conceptvectorDB
        ```
    - Upgrade the database
        - change the directory to `conceptvector/server` & run the following command
        ```
        python manage.py db upgrade
        ```

6. Test the server
    - Activate `conceptvector` environment
        ```
        source activate conceptvector
        ```
    - Change the directory to `conceptvector/server` & run the following command
        ```
        python manage.py db runserver
        
        ```
