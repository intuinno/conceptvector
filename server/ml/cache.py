import collections

# simple Least Recently Used Cache
# inspired by https://www.kunxi.org/blog/2014/05/lru-cache-in-python/
class LRUCache:
  def __init__(self, capacity):
    self._cache = collections.OrderedDict()
    self._capacity = capacity

  def __setitem__(self, key, value):
    if key in self._cache:
      self._cache.pop(key)
    elif len(self._cache) >= self._capacity:
      self._cache.popitem(last=False)
    self._cache[key] = value

  def __getitem__(self, key):
    if key in self._cache:
      value = self._cache.pop(key)
      # put in the back
      self._cache[key] = value
      return value
    else:
      return None

  def __contains__(self, key):
    return key in self._cache
