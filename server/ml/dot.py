import numpy as np

class DotModel:
  def __init__(self, embedding_model):
    self.embedding_model = embedding_model
    self.pos_score = []
    self.neg_score = []
    self.irr_score = []

  def learn(self, pos_words=[], neg_words=[], irr_words=[]):
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

    # bipolar score is based on joint probability because some words can have
    # an extremly confident positive or negative conditionals because both
    # can be very small values.
    self.bipolar_score = (self.pos_score - self.neg_score)/self.num_all_seeds

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
    return (pos/s, neg/s, irr/s)

  def recommend_pos_words(self, how_many=100):
    top_indicies = np.argsort(-self.bipolar_score)  # reverse sort
    candidates = top_indicies[:(how_many + len(self.pos_words))]
    # filter the self.pos_words from the recommendation
    candidates = [x for x in candidates if x not in self.pos_words_indicies]
    return [self.embedding_model.get_word(x) for x in candidates[:how_many]]

  def recommend_neg_words(self, how_many=100):
    top_indicies = np.argsort(self.bipolar_score)
    candidates = top_indicies[:(how_many + len(self.neg_words))]
    candidates = [x for x in candidates if x not in self.neg_words_indicies]
    return [self.embedding_model.get_word(x) for x in candidates[:how_many]]

  def _compute_unnormalized_density(self, target_words):
    result = np.zeros((len(self.embedding_model.vocabulary),))
    for word in target_words:
      distances = self.embedding_model.compute_all_distances_from_a_word(word)
      result += self._unnormalized_gaussian(distances)
    return result

  def _unnormalized_gaussian(self, distance):
    return np.exp(- np.square(distance) / (2*self.h_sq))
