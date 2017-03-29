import numpy as np
import re
# import ipdb

class KdeModel:
  def __init__(self, embedding_model):
    self.embedding_model = embedding_model
    self.h_sq = 0.5
    self.bipolar_sim_thres = 1e-2
    self.pos_score = []
    self.neg_score = []
    self.irr_score = []

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
    self.num_all_seeds = len(pos_words) + len(neg_words) + len(irr_words)

    self.pos_score = self._compute_unnormalized_density(pos_words)
    self.neg_score = self._compute_unnormalized_density(neg_words)
    self.irr_score = self._compute_unnormalized_density(irr_words)
    self.irrelevancy = self.irr_score / (self.pos_score + self.neg_score + self.irr_score)

    # bipolar score is based on joint probability because some words can have
    # an extremly confident positive or negative conditionals because both
    # can be very small values.
    self.bipolar_score = (self.pos_score - self.neg_score)/self.num_all_seeds * (1 - self.irrelevancy)

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
    bipolar_scores = [self.get_bipolar(word.lower()) for word in words]
    bipolar_avg = sum(bipolar_scores)/len(bipolar_scores)
    return bipolar_avg

  def _compute_unnormalized_density(self, target_words):
    result = np.zeros((len(self.embedding_model.vocabulary),))
    for word in target_words:
      distances = self.embedding_model.compute_all_distances_from_a_word(word)
      result += self._unnormalized_gaussian(distances)
    return result

  def _compute_unnormalized_density_ret_dist(self, target_words):
    ret_list = []
    result = np.zeros((len(self.embedding_model.vocabulary),))
    for word in target_words:
      # ipdb.set_trace()
      # from IPython.core.debugger import Tracer; Tracer()()
      distances = self.embedding_model.compute_all_distances_from_a_word(word)
      result += self._unnormalized_gaussian(distances)
    return [distances, result]

  def _unnormalized_gaussian(self, distance):
    return np.exp(- np.square(distance) / (2*self.h_sq))

  def getKeywordsScore(self, words, concept_type, how_many=100):
    # import ipdb; ipdb.set_trace()
    keywords = {}
    if concept_type == 'unipolar':
        keywords['positiveWords'] = self.get_keywords(words,how_many, True)
    elif concept_type == 'bipolar':
        keywords['positiveWords'] = self.get_keywords(words,how_many, True)
        keywords['negativeWords'] = self.get_keywords(words,how_many, False)
    return keywords

 # def get_bottom_keywords(self, words, how_many=100,):
  #   words_indicies = [(x, self.get_bipolar(x)) for x in words]
  #   words_indices_sorted = sorted(words_indicies, key= lambda x: x[1])
  #   return [x for x in words_indices_sorted[:how_many]]
