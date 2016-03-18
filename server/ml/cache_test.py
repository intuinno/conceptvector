import cache

c = cache.LRUCache(3)

for i in xrange(5):
  c[i] = i

print c[1]
print c[2]
print c[3]
print c[4]
print c[5]

if c[1]:
  print 'found 1'

if c[3]:
  print 'found 3'

if 1 in c:
  print 'found 1'

if 3 in c:
  print 'found 3'
