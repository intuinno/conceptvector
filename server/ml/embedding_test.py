# just a crude testing scripts (not a unit test)
import embedding

datafile = '../../data/glove.6B.50d.txt'
model = embedding.EmbeddingModel(datafile)

print model.get_embedding_for_words(['asdfasdf'])
print model.get_embedding_for_words(['hello', 'hi'])

print model.recommend_words_from_words(['hello'], how_many=10)
print model.recommend_words_from_words(['hello'], how_many=10))
print model.recommend_words_from_words(['hello'], how_many=10))
