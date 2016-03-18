import embedding
import kde

datafile = '../../data/glove.6B.50d.txt'
embedding_model = embedding.EmbeddingModel(datafile, cache_capacity=2)
kde_model = kde.KdeModel(embedding_model)

kde_model.learn(h_sq=0.2, pos_words=['happy'], neg_words=['sad'])
print kde_model.recommend_pos_words(how_many=10)
print kde_model.recommend_neg_words(how_many=10)

# should match caching
kde_model.learn(h_sq=0.2, pos_words=['happy', 'excited'], neg_words=['sad'])
print kde_model.recommend_pos_words(how_many=10)
print kde_model.recommend_neg_words(how_many=10)

# should match caching
kde_model.learn(h_sq=0.2, pos_words=['happy', 'excited'], neg_words=['sad'])
print kde_model.recommend_pos_words(how_many=10)
print kde_model.recommend_neg_words(how_many=10)
