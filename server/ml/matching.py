import numpy as np
from sklearn.utils import linear_assignment_ as hungarian

def count_non_overlapping(a, b):
  set_a = set(a)
  set_b = set(b)
  return len(set_a ^ set_b)

def solve_matching(num_cluster, old_cluster, new_cluster):
  """Solves the hungarian matching based on the non-overlapping words."""
  cost_matrix = np.array([[0]*num_cluster]*num_cluster)
  for i in old_cluster:
    for j in new_cluster:
      cost_matrix[i][j] = count_non_overlapping(old_cluster[i], new_cluster[j])
  assignments = hungarian.linear_assignment(cost_matrix)
  mapping = {}
  for i in xrange(assignments.shape[0]):
    mapping[i] = assignments[i, 1]
  return mapping
