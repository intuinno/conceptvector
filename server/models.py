from appModule import db, bcrypt
from sqlalchemy.dialects.postgresql import JSON
import datetime
from marshmallow_jsonapi import Schema, fields 
from marshmallow import validate

class CRUD():
	def add(self, resource):
		db.session.add(resource)
		return db.session.commit()

	def update(self):
		return db.session.commit()

	def delete(self, resource):
		db.session.delete(resource)
		return db.session.commit()


class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), nullable=True, default="User")
	email = db.Column(db.String(255), index=True, unique=True, nullable=False)
	password = db.Column(db.String(255), nullable=False)
	registered_on = db.Column(db.DateTime, nullable=False)
	admin = db.Column(db.Boolean, nullable=False, default=False)
	concepts = db.relationship('Concepts', backref="users", cascade="all, delete-orphan", lazy="dynamic")

	def __init__(self, name, email, password, admin=False):
		self.name = name
		self.email = email
		self.password = bcrypt.generate_password_hash(password)
		self.registered_on = datetime.datetime.now()
		self.admin = admin

	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return self.id

	def __repr__(self):
		return '<id {}>'.format(self.id)


class Concepts(db.Model, CRUD):
	__tablename__ = 'concepts'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), nullable=False)
	created_on = db.Column(db.DateTime, nullable=False)
	edited_on = db.Column(db.DateTime, nullable=False)
	creator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	creator_name = db.Column(db.String(255), nullable=False)
	
	concept_type=db.Column(db.String(20), default='bipolar', nullable=False)
	input_terms=db.Column(JSON)

	def __init__(self, name, creator_id, concept_type, input_terms, creator_name ):
		self.name = name
		self.creator_id = creator_id
		self.concept_type = concept_type
		self.input_terms = input_terms
		self.created_on = datetime.datetime.now()
		self.edited_on = datetime.datetime.now()
		self.creator_name = creator_name

	def get_id(self):
		return self.id

	def __repr__(self):
		return '<id {}>'.format(self.id)

class ConceptsSchema(Schema):
	
	not_blank = validate.Length(min=1, error='Field cannot be blank')
	id = fields.Integer(dump_only=False)
	name = fields.Str()
	created_on = fields.DateTime()
	creator_id = fields.Integer()
	concept_type = fields.Str()
	input_terms = fields.Raw()
	creator_name = fields.Str()

	
	#self links
	def get_top_level_links(self, data, many):
		if many:
			self_link = "/concepts/"
		else:
			self_link = "/concepts/{}".format(data['id'])
		return {'self': self_link}

	class Meta:
		type_ = 'concepts'
