from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
import os
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

api = Api(app)
bcrypt = Bcrypt(app)

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

cors = CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
