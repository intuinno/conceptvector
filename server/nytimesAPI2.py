
# coding: utf-8

# # New York Times API
#
# ## API Key
#  - community API key
#    - 0292ebefdcaf75b2fb0d7e7d1404cf09:10:71572358
#  - Article Search API key
#    - c473062c4108d294756e7b3ebf2b318c:9:71572358
#  - Most Popular API key
#    - 3971a4b7969eb05ae3959d0747e76a04:13:71572358
#
#
# ## Reference
#  - http://developer.nytimes.com/apps/mykeys
#  - http://docs.python-requests.org/en/master/
#
#

# In[37]:

import requests
from time import sleep
import pickle
from sqlalchemy import create_engine
from models import Article, Comment
from sqlalchemy.orm import sessionmaker
import ipdb as pdb


# Most popular API
# Get most popular articles from last 30 days

article_file_name = 'data/most_popular_articles.pkl'
articleWithComments_file_name = 'data/article_with_comments.pkl'
comment_file_name = 'data/comments.pkl'
engine = create_engine('postgresql:///conceptvector_dev',echo=False)
Session = sessionmaker(bind=engine)
session = Session()
cache = False

community_keys = [
					'73b7bc742e7e450d8f69b41b963afe0c'
						'8ad6d0be3f6e41b7a1ca0c7dbb91bfa5',
					'864948887e8854c8703a8fb21062e930:19:71572358',
					'189bb7e323526ce6151defc70519d845:6:70236004',
					 '403a72d2dad6f7183feea341308946f3:1:72174006',
					 '5c99af22e7609df06a7168b566699ae4:11:72174619',
					 '7cd803472503bc5e9fe6dad6ffe56c43:11:72178258',
					 '0292ebefdcaf75b2fb0d7e7d1404cf09:10:71572358',
					 '5a3d3ff964c9975c0f23d1ad3437dd45:0:70179423',
					 'affcb9ccf4424a0a94d50af077c653f8:14:71569920',
					 '5f933be26992203507b0963c96c653f1:4:66447706',
					 '6adcef7a975045db61389446ca15283e:1:30173638' ]



currentKey = 0

def download_articles():
	offset = 0
	apikey = '8ad6d0be3f6e41b7a1ca0c7dbb91bfa5'

	payload = {'api-key':apikey, 'offset': offset}
	url = 'https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/30.json'

	most_popular_request = requests.get(url, params=payload)
	num_results = most_popular_request.json()['num_results']
	most_popular_articles = most_popular_request.json()['results']

	for offset in range(20,num_results,20):
		payload = {'api-key':apikey, 'offset': offset}
		most_popular_request = requests.get(url, params=payload)
		most_popular_articles += most_popular_request.json()['results']
		sleep(0.2)

	if len(most_popular_articles) != num_results:
		print "Error: Articles number does not match"

	output = file(article_file_name,'wb')
	pickle.dump(most_popular_articles, output)

# Now Add these articles into Database

def getNumComments(aUrl):

	article_url = aUrl

	try:
		comment_request = getComments(article_url)
		num_results = comment_request.json()['results']['totalCommentsFound']
		return num_results
	except Exception as e:
		pdb.set_trace()
		print e



def add_articles_database():

	input = file(article_file_name,'rb')
	most_popular_articles = pickle.load(input)
	articleWithComments = []

	for a in most_popular_articles:
		if a['id'] > 10000:
			print a['url']
			try:
				if currentKey < len(community_keys):
					articleWithComments.append( (a, download_add_comments(a)))

			except Exception as e:
				pdb.set_trace()
				print a['id']
				print e

	output = file(articleWithComments_file_name,'wb')
	pickle.dump(articleWithComments, output)


def add_replies(all, node, stacklevel):

	all.append(node)

	for n in node['replies']:
		add_replies(all, n, stacklevel+1 )

def getComments(url, offset=0):
	global currentKey
	payload = {'api-key': community_keys[currentKey], 'url': url, 'replyLimit': 10000, 'depthLimit':100, 'offset':offset}
	api_url = 'https://api.nytimes.com/svc/community/v3/user-content/url.json'
	comment_request = requests.get(api_url, params=payload)
	sleep(0.3)

	while comment_request.status_code != 200:
		if comment_request.status_code == 403:
			currentKey += 1
			print 'Key inactive: Trying new key', currentKey, comment_request.status_code, url
			payload = {'api-key': community_keys[currentKey], 'url': url, 'replyLimit': 10000, 'offset':offset,'depthLimit':100}
			comment_request = requests.get(api_url, params=payload)
		elif comment_request.status_code == 504:
			print 'Gateway Timeout', currentKey, comment_request.status_code, url
			payload = {'api-key': community_keys[currentKey], 'url': url, 'replyLimit': 10000, 'offset':offset,'depthLimit':100}
			comment_request = requests.get(api_url, params=payload)
		elif comment_request.status_code == 429:
			currentKey += 1
			print 'API rate limit exceeded', currentKey, url
			payload = {'api-key': community_keys[currentKey], 'url': url, 'replyLimit': 100, 'offset':offset,'depthLimit':100}
			comment_request = requests.get(api_url, params=payload)
		else:
			print 'Not sure why', comment_request.status_code, comment_request.text, url
			payload = {'api-key': community_keys[currentKey], 'url': url, 'replyLimit': 10000, 'offset':offset,'depthLimit':100}
			comment_request = requests.get(api_url, params=payload)
		sleep(0.3)
	return comment_request


def download_add_comments(a):
	article_url = a['url']

	try:
		comments = []
		comment_request = getComments(article_url)
		num_parent_results = comment_request.json()['results']['totalParentCommentsFound']
		num_results = comment_request.json()['results']['totalCommentsFound']
		newComments = comment_request.json()['results']['comments']
		comments += newComments
		offset = 0
		while (len(newComments) >0):
			offset += 25
			comment_request = getComments(article_url, offset)
			newComments = comment_request.json()['results']['comments']
			comments += newComments

		if len(comments) != num_parent_results:
			print "Error: Parent Comments number does not match",  a['url'], len(comments), num_parent_results

		all_comments = []
		for c in comments:
			add_replies(all_comments, c, 0)

		if len(all_comments) != num_results:
			print "Error: All Comments number does not match", a['url'], len(all_comments), num_results

	except Exception as e:
		pdb.set_trace()
		print e

	return all_comments

# download_articles()
add_articles_database()
