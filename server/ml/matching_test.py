import matching

# Examples
old_cluster = {0:['happy', 'hello'], 1:['sad', 'depressed'], 2:['funky']}
new_cluster = {1:['happy'], 2:['sad', 'depressed'], 0:['funky']}

print 'old_cluster', old_cluster
print 'new_cluster', new_cluster
print matching.solve_matching(3, old_cluster, new_cluster)
