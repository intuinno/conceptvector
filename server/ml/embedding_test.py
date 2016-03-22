# just a crude testing scripts (not a unit test)
import embedding
from sklearn import cluster

datafile = '../../data/glove.6B.50d.txt'
model = embedding.EmbeddingModel(datafile)

print model.get_embedding_for_words(['asdfasdf'])
print model.get_embedding_for_words(['hello', 'hi'])

recommended = ['happy', 'sad', 'excited', 'happy', 'happy']
embeddings = [model.get_embedding_for_a_word(x) for x in recommended]
print embeddings
print [x.tolist() for x in embeddings]

kmeans = cluster.KMeans(n_clusters=3)
print kmeans.fit_predict(embeddings)
