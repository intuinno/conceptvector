# conceptvector

## Setting up the environment

#### 1. Install `Anaconda`

- Download the latest distribution

    ``` 
    wget https://repo.continuum.io/archive/Anaconda2-5.3.0-Linux-x86_64.sh 
    ```

- Execute the script

    ```
    bash /path../to../Anaconda2-5.3.0-Linux-x86_64.sh
    ```

#### 2. Create a custom environment

- create a conda environment 'conceptvector'
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

- Change the directory to `conceptvector/clinet` 
    ```
    cd /..path../..to../conceptvector/clinet
    ```
- Run the following commands
    ```
    npm install
    bower install
    grunt serve
    grunt build
    ```
