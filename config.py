class Config(object):
	DEBUG = False
	TESTING = False
	CSRF_ENABLED = True
	SECRET_KEY = 'temp key'

class ProductionConfig(Config):
	DEBUG = False 

class StagingConfig(Config):
	DEBUG = True
	DEVELOPMENT = True

class DevelopmentConfig(Config):
	DEVELOPMENT = True
	DEBUG = True

class TestingConfig(Config):
	TESTING = True

