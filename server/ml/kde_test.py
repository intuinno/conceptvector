import embedding
import kde
import reader

embedding_file = 'data/glove.6B.50d.txt'
comment_file = 'data/comment_dump.csv'
embedding_model = embedding.EmbeddingModel(embedding_file, cache_capacity=2)
kde_model = kde.KdeModel(embedding_model)
comments = reader.read_comment_bodys(comment_file, 100000004235555)

# kde_model.learn(h_sq=0.2, pos_words=['happy', 'excited'], neg_words=['sad'])
kde_model.learn(h_sq=0.2, pos_words=['immigration', 'citizenship', 'naturalization', 'asylum', 'nationality', 'deportation', 'visa', 'visas', 'extradition', 'custody', 'immigrants', 'undocumented', 'migrants'])

# print kde_model.recommend_pos_words(how_many=10)
# print kde_model.recommend_neg_words(how_many=10)

print kde_model.get_comment_score_from_text('Immigration!Hello')

comment_score_pairs = []
for comment in comments:
  # import ipdb; ipdb.set_trace()
  score = kde_model.get_comment_score_from_word_sequence(comment)
  comment_score_pairs.append((score, comment))

sorted_list = sorted(comment_score_pairs, key=lambda x: x[0], reverse=True)

print '\npos list'
for item in sorted_list[:15]:
  print item[0], ' '.join(item[1])

for item in sorted_list[-5:]:
  print item[0], ' '.join(item[1])
