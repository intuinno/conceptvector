from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

api = Api(app)

from models import User

# from api import  models

# test

class CreateUser(Resource):
	def post(self):
		try:
			# Parse the arguments
			parser = reqparse.RequestParser()
			parser.add_argument('email', type=str, help='Email address to create user')
			parser.add_argument('password', type=str, help='Password to create user')

			args = parser.parse_args()

			_userEmail = args['email']
			_userPassword = args['password']

			user = User(email=_userEmail, password=_userPassword)
			db.session.add(user)
			db.session.commit()

			return {'StatusCode':'200', 'Message':'User creation success'}

		except Exception as e:
			return {'error': str(e)}

api.add_resource(CreateUser, '/CreateUser')

if __name__ == '__main__':
	app.run()

