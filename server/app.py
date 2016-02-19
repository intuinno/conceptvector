from flask import Flask, request, jsonify, session
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse
import os
import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
from flask.ext.cors import CORS
import pdb

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

from models import User
import pickle

headerNames = ['word'] + range(300)
wordsFileName = './data/glove.6B.300d.txt'
wordsModel = pd.read_csv(wordsFileName, delim_whitespace=True, quoting=3, header=None, names=headerNames, skiprows=0, index_col=0)
wordsLabel = wordsModel.index.tolist()
wordsModelNumpy = wordsModel.as_matrix()

# pkl_file = open('./data/glove.pkl','rb')
# wordsModel = pickle.load(pkl_file)

# print np.__config__.show()

# wordsLabel = wordsModel['word'].tolist()

# print wordsLabel

class RecommendWords(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			parser.add_argument('positiveWords', type=unicode, action='append', required=True, help="Positive words cannot be blank!")
			parser.add_argument('negativeWords', type=unicode, action='append', help='Negative words')

			args = parser.parse_args()

			# pdb.set_trace()

			positive_terms = args['positiveWords']

			positive_terms = [w.encode('UTF-8') for w in positive_terms]
			negative_terms = args['negativeWords']



			positive_terms_models = wordsModel.loc[positive_terms,:].mean()

			if negative_terms is None:
			    negative_terms_models = np.zeros(300)
			else:
			    negative_terms = [w.encode('UTF-8') for w in negative_terms]

			    negative_terms_models = wordsModel.loc[negative_terms,:].mean()

			concept_vector_group = positive_terms_models - negative_terms_models
			concept_value = np.dot(wordsModelNumpy, concept_vector_group)

			df = pd.DataFrame(concept_value, index=wordsModel.index)
			df.drop(positive_terms, inplace=True)
			df.drop(negative_terms, inplace=True)
			df.sort_values(by=0, inplace=True, ascending=False)
			df.head()
			print df[:30]


			return jsonify(positiveRecommend=df[:20].index.tolist(), negativeRecommend=df[-20:].index.tolist())

		except Exception as e:
			return {'error': str(e)}


class QueryAutoComplete(Resource):
  def get(self, word):
    wordUTF8 = word.encode('UTF-8')
    new_list = [{'text':x} for x in wordsLabel if not isinstance(x, float) and x.startswith(wordUTF8)]
    return {'word': new_list}

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
			db.session.close()

			return {'StatusCode':'200', 'Message':'User creation success'}

		except Exception as e:
			return {'error': str(e)}

class AuthenticateUser(Resource):
	def post(self):
		try:
			# Parse the arguments

			parser = reqparse.RequestParser()
			parser.add_argument('email', type=str, help='Email address for Authentification')
			parser.add_argument('password', type=str, help='Password for Authentication')
			args = parser.parse_args()

			_userEmail = args['email']
			_userPassword = args['password']

			user = User.query.filter_by(email=_userEmail).first()
			if user and bcrypt.check_password_hash(user.password, _userPassword):
				session['logged_in'] = True
				status = True
			else:
				status = False
			return jsonify({'result':status})
		except Exception as e:
			return {'error':str(e)}


api.add_resource(CreateUser, '/CreateUser')
api.add_resource(AuthenticateUser, '/AuthenticateUser')
api.add_resource(QueryAutoComplete, '/QueryAutoComplete/<string:word>')
api.add_resource(RecommendWords, '/RecommendWords')


if __name__ == '__main__':
	app.run(host='0.0.0.0', port='5000', debug=True)

