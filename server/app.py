from flask import Flask, request, jsonify, session, make_response
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse
import os
import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine,cdist
from sklearn.cluster import KMeans
from flask.ext.cors import CORS
import pdb
from sklearn.preprocessing import normalize

from sqlalchemy.exc import SQLAlchemyError
from marshmallow import ValidationError


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

api = Api(app)
bcrypt = Bcrypt(app)
# CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

from models import User, Concepts, ConceptsSchema
import pickle


schema = ConceptsSchema()

headerNames = ['word'] + range(300)
wordsFileName = './data/glove.6B.300d.txt'
wordsModel = pd.read_csv(wordsFileName, delim_whitespace=True, quoting=3, header=None, names=headerNames, skiprows=0, index_col=0)
print wordsModel.head()

wordsLabel = wordsModel.index.tolist()
wordsModelNorm = pd.DataFrame(normalize(wordsModel.as_matrix(), norm='l2'), index=wordsLabel)
print wordsModel.head()

wordsModelNumpyNorm = wordsModelNorm.as_matrix()




# @app.after_request
# def after_request(response):
# 	# pdb.set_trace()
# 	response.headers.add('Access-Control-Allow-Origin', '*')
# 	response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
# 	response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
# 	return response



class RecommendWordsCluster(Resource):

	def post(self):
		try:
			# pdb.set_trace()
			parser = reqparse.RequestParser()
			parser.add_argument('positiveWords', type=unicode, action='append', required=True, help="Positive words cannot be blank!")
			parser.add_argument('negativeWords', type=unicode, action='append', help='Negative words')

			args = parser.parse_args()

			# pdb.set_trace()

			positive_terms = args['positiveWords']

			positive_terms = [w.encode('UTF-8') for w in positive_terms]
			negative_terms = args['negativeWords']
			print positive_terms



			positive_terms_models = wordsModel.loc[positive_terms,:].mean()

			if negative_terms is None:
			    negative_terms_models = np.zeros(300)
			else:
			    negative_terms = [w.encode('UTF-8') for w in negative_terms]

			    negative_terms_models = wordsModel.loc[negative_terms,:].mean()

			concept_vector_group = positive_terms_models - negative_terms_models

			# pdb.set_trace()
			concept_value = np.dot(wordsModelNumpyNorm, concept_vector_group)

			df = pd.DataFrame(concept_value, index=wordsModel.index)
			df.drop(positive_terms, inplace=True)
			df.drop(negative_terms, inplace=True)
			df.sort_values(by=0, inplace=True, ascending=False)
			df.head()
			top50 = wordsModel.loc[df[:50].index,:]
			positiveY = KMeans(n_clusters=5).fit_predict(top50.values)
			bottom50 = wordsModel.loc[df[-50:].index,:]
			negativeY = KMeans(n_clusters=5).fit_predict(bottom50.values)
			# top50.to_csv("data.csv")
			if positive_terms is None:
				positiveSearchTermVectors = []
			else:
				positiveSearchTermVectors =  wordsModel.loc[positive_terms,:].values.tolist()
			
			if negative_terms is None:
				negativeSearchTermVectors = []
			else:
				negativeSearchTermVectors = wordsModel.loc[negative_terms,:].values.tolist()

			return jsonify(positiveRecommend=df[:50].index.tolist(), positiveCluster=positiveY.tolist(), negativeRecommend=df[-50:].index.tolist(), negativeCluster=negativeY.tolist(), positiveVectors=top50.values.tolist(), positiveSearchTermVectors = positiveSearchTermVectors ,negativeVectors=bottom50.values.tolist(), negativeSearchTermVectors = negativeSearchTermVectors)

		except Exception as e:
			# pdb.set_trace()
			return {'error': str(e)}

class QueryAutoComplete(Resource):
  def get(self, word):
    wordUTF8 = word.encode('UTF-8')
    new_list = [{'text':x} for x in wordsLabel if not isinstance(x, float) and x.startswith(wordUTF8)]
    return {'word': new_list}

class Register(Resource):
	def post(self):
	
		# Parse the arguments
		parser = reqparse.RequestParser()
		# import pdb; pdb.set_trace()
		parser.add_argument('name', type=str, help="User name to be called")
		parser.add_argument('email', type=str, help='Email address to create user')
		parser.add_argument('password', type=str, help='Password to create user')

		args = parser.parse_args()

		_userName = args['name']
		_userEmail = args['email']
		_userPassword = args['password']

		user = User(name=_userName, email=_userEmail, password=_userPassword)
		try:
			db.session.add(user)
			db.session.commit()
			status = 'success'

		except Exception as e:
			# pdb.set_trace()
			status = 'This user is already registered'
			db.session.close()

		return {'result': status}

class Login(Resource):
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
				session['user'] = user.id
				session['userName'] = user.name
				status = True
			else:
				status = False

			# pdb.set_trace()
			return jsonify({'result':status, 'name': user.name})
		except Exception as e:
			# pdb.set_trace()
			return {'error':str(e)}

class Logout(Resource):
	def get(self):
		try:
			# Parse the arguments
			session.pop('logged_in', None)
			session.pop('user', None)
			session.pop('userName', None)
			
			return {'result':'success'}
		except Exception as e:
			return {'error':str(e)}

class Status(Resource):
	def get(self):
		# pdb.set_trace()
		if session.get('logged_in'):
			if session['logged_in']:
				return {'status':True, 'user': session['user']}
		else:
			return {'status':False}

class ConceptList(Resource):
	def get(self):
		concepts_query = Concepts.query.all()
		results =  schema.dump(concepts_query, many=True).data
		return results

	def post(self):
		raw_dict = request.get_json(force=True)
		# import pdb; pdb.set_trace()
		try:
			schema.validate(raw_dict)
			concept_dict = raw_dict['data']['attributes']
			# import pdb;pdb.set_trace()

			if session.get('logged_in'):
				userID = session['user']
				userName = session['userName']
			else:
				return {'status':"UnAuthorized Access for Post ConceptList"}

			concept = Concepts(concept_dict['name'], userID, concept_dict['concept_type'], concept_dict['input_terms'], userName)
			concept.add(concept)

			query = Concepts.query.get(concept.id)
			results = schema.dump(query).data

			return results, 201
		
		except ValidationError as err:
			resp = jsonify({"error":err.messages})
			resp.status_code = 403
			return resp

		except SQLAlchemyError as e:
			db.session.rollback()
			resp = jsonify({"error": str(e)})
			resp.status_code = 403
			return resp


class ConceptsUpdate(Resource):
	def get(self,id):
		concept_query = Concepts.query.get_or_404(id)
		result = schema.dump(concept_query).data
		# import pdb;pdb.set_trace()
		return result

	def patch(self,id):
		concept = Concepts.query.get_or_404(id)
		raw_dict = request.get_json(force=True)

		try:
			schema.validate(raw_dict)
			concept_dict = raw_dict['data']['attributes']

			for key, value in concept_dict.items():
				setattr(concept, key, value)

			concept.update()
			return self.get(id)

		except ValidationError as err:
			resp = jsonify({"error":err.messages})
			resp.status_code = 401
			return resp

		except SQLAlchemyError as e:
			db.session.rollback()
			resp = jsonify({"error": str(e)})
			resp.status_code = 401
			return resp
		
	def delete(self, id):
		concept = Concepts.query.get_or_404(id)
		try: 
			delete = concept.delete(concept)
			concepts_query = Concepts.query.all()
			results =  schema.dump(concepts_query, many=True).data
			return results
		except SQLAlchemyError as e:
			db.session.rollback()
			resp = jsonify({"error": str(e)})
			resp.status_code = 401
			return resp


api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')
api.add_resource(QueryAutoComplete, '/api/QueryAutoComplete/<string:word>')
api.add_resource(RecommendWordsCluster, '/api/RecommendWordsCluster')
api.add_resource(Status, '/api/status')
api.add_resource(ConceptList, '/api/concepts')
api.add_resource(ConceptsUpdate, '/api/concepts/<int:id>')

if __name__ == '__main__':
	app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
	app.run(host='localhost', port='9000', debug=True)

