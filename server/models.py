from app import db
from sqlalchemy.dialects.postgresql import JSON

class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(), index=True, unique=True)
	password = db.Column(db.String())

	def __init__(self, email, password):
		self.email = email
		self.password = password

	def __repr__(self):
		return '<id {}>'.format(self.id)

