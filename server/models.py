from app import db, bcrypt
from sqlalchemy.dialects.postgresql import JSON
import datetime


class User(db.Model):
	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(255), nullable=True, default="User")
	email = db.Column(db.String(255), index=True, unique=True, nullable=False)
	password = db.Column(db.String(255), nullable=False)
	registered_on = db.Column(db.DateTime, nullable=False)
	admin = db.Column(db.Boolean, nullable=False, default=False)

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

