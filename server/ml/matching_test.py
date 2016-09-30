import matching

# Examples
old_cluster = {0: ['happy', 'hello'], 1: ['sad', 'depressed'], 2: ['funky']}
new_cluster = {1: ['happy'], 2: ['sad', 'depressed'], 0: ['funky']}

print 'old_cluster', old_cluster
print 'new_cluster', new_cluster
print matching.solve_matching(3, old_cluster, new_cluster)


old_cluster = {0: ['everyone', 'everybody', 'maybe', "'d", "'m", 'really', 'guess', 'something', 'anyway', 'else', 'thing', 'sure', 'good', 'myself', 'yes', 'anymore', 'nobody', 'knowing', 'knows', 'nothing', 'think', 'know', 'me', 'happens'], 1: ['definitely', 'always', 'feels', 'feel', 'obviously', 'hardly', 'certainly', 'moment'], 2: ['imagine', 'wonder', 'remember', 'lucky', 'crazy', 'luck', 'liked', 'wish', 'likes', 'loved'], 3: ['talking', 'seeing', 'come', 'watching', 'gone'], 4: ['glad', 'thrilled', 'proud']}

new_cluster = {0: ['definitely', 'obviously', 'surely', 'hardly', 'realized', 'unfortunately', 'certainly'], 1: ['everybody', 'everyone', 'maybe', 'nobody', 'myself', "'d", 'feels', 'else', 'sure', "'m", 'always', 'knows', 'talking', 'really', 'feel', 'something'], 2: ['imagine', 'anyway', 'guess', 'anymore', 'okay', 'knowing', 'figured', 'remember', 'sorry', 'luck', 'yes', 'liked', 'hopefully', 'wonder', 'lucky', 'forget', 'forgot', 'ok', 'honestly'], 3: ['thrilled', 'pleased', 'thankful', 'surprised', 'delighted', 'proud'], 4: ['wish', 'thank']}

print 'old_cluster', old_cluster
print 'new_cluster', new_cluster
print matching.solve_matching(5, old_cluster, new_cluster)
mapping = matching.solve_matching(5, old_cluster, new_cluster)
# positive_clusters = [mapping[x] for x in positive_clusters]
current_clustering_remapped = {}
for k, v in new_cluster.iteritems():
    current_clustering_remapped[mapping[k]] = v
print current_clustering_remapped

positive_recommend = []
positive_clusters = []
for key,value in current_clustering_remapped.iteritems():
	for w in value:
		positive_recommend.append(w)
		positive_clusters.append(key)

print positive_recommend
print positive_clusters


old_cluster = {0: ['maybe', "'d", 'guess', 'anyway', 'else', 'yes', 'anymore', 'nobody', 'come', 'gone', 'happens'], 1: ['everyone', 'everybody', 'always', "'m", 'really', 'something', 'feel', 'thing', 'sure', 'good', 'myself', 'think', 'know', 'me'], 2: ['imagine', 'wonder', 'remember', 'lucky', 'crazy', 'luck', 'talking', 'liked', 'seeing', 'knows', 'watching', 'likes', 'loved'], 3: ['definitely', 'feels', 'obviously', 'hardly', 'knowing', 'certainly', 'nothing', 'moment'], 4: ['glad', 'wish', 'thrilled', 'proud']}

new_cluster = {0: ['remember', 'wish', 'forget', 'thank'], 1: ['definitely', 'imagine', 'obviously', 'knowing', 'figured', 'surely', 'luck', 'hopefully', 'hardly', 'wonder', 'realized', 'unfortunately', 'certainly', 'honestly'], 2: ['everybody', 'everyone', 'maybe', 'nobody', 'myself', "'d", 'feels', 'else', 'sure', "'m", 'always', 'knows', 'talking', 'really', 'feel', 'something'], 3: ['thrilled', 'pleased', 'thankful', 'surprised', 'delighted', 'proud'], 4: ['anyway', 'guess', 'anymore', 'okay', 'sorry', 'yes', 'liked', 'lucky', 'forgot', 'ok']}


print 'old_cluster', old_cluster
print 'new_cluster', new_cluster
print matching.solve_matching(5, old_cluster, new_cluster)
mapping = matching.solve_matching(5, old_cluster, new_cluster)
# positive_clusters = [mapping[x] for x in positive_clusters]
current_clustering_remapped = {}
for k, v in new_cluster.iteritems():
    current_clustering_remapped[mapping[k]] = v
print current_clustering_remapped

positive_recommend = []
positive_clusters = []
for key,value in current_clustering_remapped.iteritems():
	for w in value:
		positive_recommend.append(w)
		positive_clusters.append(key)

print positive_recommend
print positive_clusters
