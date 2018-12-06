from appModule import app,db

from models import *
from apiModule import *


if __name__ == '__main__':
	app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
	app.run(host='0.0.0.0', port='9000', debug=True)
