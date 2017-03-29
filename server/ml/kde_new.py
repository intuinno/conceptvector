import numpy as np
import re
# import ipdb

class KdeModel:
  def __init__(self, embedding_model):
    self.embedding_model = embedding_model
    self.h_sq = 0.5
    self.bipolar_score_thres = 5e-3
    self.n_cand_words = 50
    self.pos_score = []
    self.neg_score = []
    self.irr_score = []
    self.pos_words = []
    self.neg_words = []
    self.irr_words = []
    self.pos_words_indicies = []
    self.neg_words_indicies = []
    self.irr_words_indicies = []

  def learn(self, h_sq=0.5, pos_words=[], neg_words=[], irr_words=[]):
    self.h_sq = h_sq
    # filter out words that does not in the dictionary
    self.pos_words = [x for x in pos_words if self.embedding_model.has_word(x)]
    self.neg_words = [x for x in neg_words if self.embedding_model.has_word(x)]
    self.irr_words = [x for x in irr_words if self.embedding_model.has_word(x)]
    self.pos_words_indicies = [self.embedding_model.find_word(x)
                               for x in self.pos_words]
    self.neg_words_indicies = [self.embedding_model.find_word(x)
                               for x in self.neg_words]
    self.irr_words_indicies = [self.embedding_model.find_word(x)
                               for x in self.irr_words]
    # self.num_all_seeds = len(pos_words) + len(neg_words) + len(irr_words)
    self.num_all_seeds = len(pos_words) + len(neg_words)

    self.pos_score = self._compute_unnormalized_density(pos_words)
    self.neg_score = self._compute_unnormalized_density(neg_words)
    self.irr_score = self._compute_unnormalized_density(irr_words)
    self.irrelevancy = self.irr_score / (self.pos_score + self.neg_score + self.irr_score)

    # bipolar score is based on joint probability because some words can have
    # an extremly confident positive or negative conditionals because both
    # can be very small values.
    self.bipolar_score = (self.pos_score - self.neg_score)/self.num_all_seeds * (1 - self.irrelevancy)

    top_indicies = np.argsort(-self.bipolar_score)
    candidates = top_indicies[:(len(self.pos_words)+len(self.neg_words)+len(self.irr_words)+self.n_cand_words)]
    candidates = [x for x in candidates if x not in self.pos_words_indicies and x not in self.neg_words_indicies and x not in self.irr_words_indicies]
    self.cand_pos_words = [self.embedding_model.get_word(x) for x in candidates[:self.n_cand_words]]

    top_indicies = np.argsort(self.bipolar_score)
    candidates = top_indicies[:(len(self.pos_words)+len(self.neg_words)+len(self.irr_words)+self.n_cand_words)]
    candidates = [x for x in candidates if x not in self.pos_words_indicies and x not in self.neg_words_indicies and x not in self.irr_words_indicies]
    self.cand_neg_words = [self.embedding_model.get_word(x) for x in candidates[:self.n_cand_words]]

  def get_bipolar(self, word):
    index = self.embedding_model.find_word(word)
    if index != None:
      return self.bipolar_score[index]
    else:
      return 0

  def get_joint(self, word):
    index = self.embedding_model.find_word(word)
    if index != None:
      return (self.pos_score[index]/self.num_all_seeds,
              self.neg_score[index]/self.num_all_seeds,
              self.irr_score[index]/self.num_all_seeds)
    else:
      return (0, 0, 1)

  def get_conditional(self, word):
    pos, neg, irr = self.get_joint(word)
    s = pos + neg + irr
    if s > 0:
      return (pos/s, neg/s, irr/s)
    else:
      return (0.0, 0.0, 0.0)

  def recommend_pos_words(self, how_many=100):
    top_indicies = np.argsort(-self.bipolar_score)  # reverse sort
    candidates = top_indicies[:(how_many + len(self.pos_words)) + len(self.irr_words)]
    # filter the self.pos_words from the recommendation
    candidates = [x for x in candidates if x not in self.pos_words_indicies and x not in self.irr_words_indicies]
    return [self.embedding_model.get_word(x) for x in candidates[:how_many]]

  def recommend_neg_words(self, how_many=100):
    top_indicies = np.argsort(self.bipolar_score)
    candidates = top_indicies[:(how_many + len(self.neg_words) + len(self.irr_words))]
    candidates = [x for x in candidates if x not in self.neg_words_indicies and x not in self.irr_words_indicies]
    return [self.embedding_model.get_word(x) for x in candidates[:how_many]]

  def get_comment_score_from_text(self, text):
    sequence = re.sub('[^a-z]+', ' ', text.lower()).split()
    return self.get_comment_score_from_word_sequence(sequence)

  def get_comment_score_from_word_sequence(self, words):
    # bipolar_scores = [self.get_bipolar(word.lower()) for word in words]
    # bipolar_avg = sum(bipolar_scores)/len(bipolar_scores)
    # print bipolar_avg
    # return bipolar_avg
    # bipolar_scores = sum([self.get_bipolar(word.lower()) for word in words if np.abs(self.get_bipolar(word.lower()))>self.bipolar_score_thres])
    bipolar_scores = sum([self.get_bipolar(word.lower()) for word in words if word in self.pos_words or word in self.cand_pos_words or word in self.neg_words or word in self.cand_neg_words])
    # tmp_str = "Positive words: "
    # for word in words:
    #   # if self.get_bipolar(word.lower())>self.bipolar_score_thres:
    #   if word in self.pos_words or word in self.cand_pos_words:
    #     tmp_str = tmp_str + "%s:%f, " % (word.lower(),self.get_bipolar(word.lower()))
    # print tmp_str
    # tmp_str = "Negative words: "
    # for word in words:
    #   # if self.get_bipolar(word.lower())<(-1)*self.bipolar_score_thres:
    #   if word in self.neg_words or word in self.cand_neg_words:
    #     tmp_str = tmp_str + "%s:%f, " % (word.lower(),self.get_bipolar(word.lower()))
    # print tmp_str
    return bipolar_scores

  def _compute_unnormalized_density(self, target_words):
    result = np.zeros((len(self.embedding_model.vocabulary),))
    for word in target_words:
      distances = self.embedding_model.compute_all_distances_from_a_word(word)
      result += self._unnormalized_gaussian(distances)
    return result

  def _unnormalized_gaussian(self, distance):
    # if (distance > self.dist_thres)
    #   return 0
    # else
    return np.exp(- np.square(distance) / (2*self.h_sq))

  def getKeywordsScore(self, words, concept_type):
    # import ipdb; ipdb.set_trace()
    keywords = {}
    if concept_type == 'unipolar':
        keywords['positiveWords'] = self.get_keywords(words,reverse=True)
    elif concept_type == 'bipolar':
        keywords['positiveWords'] = self.get_keywords(words,reverse=True)
        keywords['negativeWords'] = self.get_keywords(words,reverse=False)
    return keywords

  def get_keywords(self, words, reverse=True):
    # ipdb.set_trace()
    # words_indicies = [(x, self.get_bipolar(x)) for x in words]
    # words_indices_sorted = sorted(words_indicies, key= lambda x: x[1], reverse=reverse)
    # return [x for x in words_indices_sorted[:how_many]]
    if reverse:
      word_list = self.pos_words +  self.cand_pos_words
    else:
      word_list = self.neg_words +  self.cand_neg_words

    print "hehe"
    print word_list
    return [(word,self.get_bipolar(word)) for word in word_list]

  def get_keywords_abs_thres(self, words, reverse=True):
    word_list = []
    # if reverse:
    #   for word in words:
    #     if self.get_bipolar(word.lower())>self.bipolar_score_thres:
    #       word_list.append((word.lower(),self.get_bipolar(word.lower())))
    # else:
    #   for word in words:
    #     if self.get_bipolar(word.lower())<(-1)*self.bipolar_score_thres:
    #       word_list.append((word.lower(),self.get_bipolar(word.lower())))
    # tmp_str = "Positive words!!!!: "
    # for word in words:
    #   if self.get_bipolar(word.lower())<(-1)*self.bipolar_score_thres:
    #     tmp_str = tmp_str + "%s:%f, " % (word.lower(),self.get_bipolar(word.lower()))
    # print tmp_str
    # for word in words:
    #   if self.get_bipolar(word.lower())>self.bipolar_score_thres:
    #     tmp_str = tmp_str + "%s:%f, " % (word.lower(),self.get_bipolar(word.lower()))
    # print tmp_str
    # tmp_str = "Negative words!!!!: "
    # for word in words:
    #   if self.get_bipolar(word.lower())<(-1)*self.bipolar_score_thres:
    #     tmp_str = tmp_str + "%s:%f, " % (word.lower(),self.get_bipolar(word.lower()))
    # print tmp_str
    # if reverse:
    #   return [word for word in words if self.get_bipolar(word.lower())<(-1)*self.bipolar_score_thres]
    # else:
    #   return [word for word in words if self.get_bipolar(word.lower())>self.bipolar_score_thres]
    return word_list

  # def get_bottom_keywords(self, words, how_many=100,):
  #   words_indicies = [(x, self.get_bipolar(x)) for x in words]
  #   words_indices_sorted = sorted(words_indicies, key= lambda x: x[1])
  #   return [x for x in words_indices_sorted[:how_many]]
