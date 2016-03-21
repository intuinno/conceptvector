from appModule import db, bcrypt
from sqlalchemy.dialects.postgresql import JSON, ARRAY, BIGINT
import datetime
from marshmallow_jsonapi import Schema, fields 
from marshmallow import validate
import json

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
	creator = db.relationship("User", back_populates="concepts")
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

class Article(db.Model):
	__tablename__ = 'articles'

	url = db.Column(db.String)
	adx_keywords = db.Column(db.String)
	column = db.Column(db.String)
	section = db.Column(db.String)
	byline = db.Column(db.String)
	type= db.Column(db.String)
	title = db.Column(db.String)
	abstract = db.Column(db.String)
	published_date = db.Column(db.DateTime)
	source= db.Column(db.String)
	id = db.Column(BIGINT, primary_key=True)
	asset_id = db.Column(BIGINT)
	views = db.Column(db.Integer)
	des_facet = db.Column(ARRAY(db.String))
	org_facet = db.Column(ARRAY(db.String))
	per_facet = db.Column(ARRAY(db.String))
	geo_facet = db.Column(ARRAY(db.String))
	media = db.Column(ARRAY(db.String))
	commments = db.relationship("Comment", backref="article")

	def __init__(self, apiResult):
		apiResult['media'] = [ json.dumps(i) for i in apiResult['media']]
		for key, value in apiResult.iteritems():
			setattr(self, key, value)

	def __repr__(self):
		return '<URL {}>'.format(self.url)

class Comment(db.Model):
	__tablename__ = 'comments'

	approveDate = db.Column(db.String)
	commentBody = db.Column(db.String)
	commentID = db.Column(db.Integer, primary_key=True)
	commentSequence = db.Column(db.Integer)
	commentTitle = db.Column(db.String)
	commentType = db.Column(db.String)
	createDate = db.Column(db.String)
	depth = db.Column(db.Integer)
	editorsSelection = db.Column(db.Boolean)
	parentID = db.Column(db.Integer, db.ForeignKey('comments.commentID'))
	parentUserDisplayName = db.Column(db.String)
	permID = db.Column(db.String)
	picURL = db.Column(db.String)
	recommendations = db.Column(db.Integer)
	replies = db.relationship("Comment")
	replyCount = db.Column(db.Integer)
	reportAbuseFlag = db.Column(db.String)
	status = db.Column(db.String)
	trusted = db.Column(db.Integer)
	updateDate = db.Column(db.String)
	userID = db.Column(db.Integer)
	userDisplayName = db.Column(db.String)
	userTitle = db.Column(db.String)
	userURL = db.Column(db.String)
	userLocation = db.Column(db.String)
	assetID = db.Column(db.Integer, db.ForeignKey('articles.id'))
	

	def __init__(self, apiResult):
		del apiResult['replies'] 
		for key, value in apiResult.iteritems():
			setattr(self, key, value)

	def __repr__(self):
		return '<id {}>'.format(self.commentID)




