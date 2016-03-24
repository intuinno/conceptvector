import numpy as np
import pandas as pd
import re

def read_comment_bodys(filename, asset_id, filter_f= None):
  pd_comments = pd.read_csv(filename)
  pd_comments = pd_comments[pd_comments['assetID'] == asset_id]
  comments = []
  for item in pd_comments['commentBody']:
    comment_tuple = re.sub('[^a-zA-Z0-9 ]+',
        "",str(item).lower()).split()
    if filter_f == None or filter_f(comment_tuple):
      comments.append(comment_tuple)
  return comments

# def read_stopwords(filename):
#   words = []
#   with open(filename, 'r') as filehandler:
#     for line in filehandler:
#       words.append(re.sub('[^a-zA-Z0-9 ]+', '_', line.strip()))
#   return words

# def read_article_headlines(filename):
#   pd_articles = pd.read_csv(filename)
#
#
# originalComments = pd.read_csv('comments_study.csv')
# originalArticles = pd.read_csv('articles.csv')
#
# a = originalArticles.headline[0]
# cnt = 0
# artUrl = []
# for i in range(len(originalArticles)):
#     oa = re.sub("[^a-zA-Z0-9 ]+", "", str(originalArticles.headline[i]).lower()).split()
#     if 'obama' in oa:
#         artUrl.append(originalArticles.articleURL[i])
#         cnt += 1
# print 'num of articles : ', cnt
