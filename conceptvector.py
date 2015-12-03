__author__ = 'intuinno'


from nltk.corpus import wordnet as wn
from itertools import chain

def flatten(l):
    return list( chain ( *l ) )

def get_variants(word):
    synonyms = []
    for syn in wn.synsets(word):
        synonyms.append( [syn.lemmas] )
        synonyms.append([ s.lemmas for s in syn.similar_tos() ] )
        synonyms.append([ s.lemmas for s in syn.hypernyms() ] )
        synonyms.append([ s.lemmas for s in syn.hyponyms() ] )

    return set( flatten( synonyms )  )

def get_synonyms(word):
    return sorted( [v.name for v in get_variants(word)] )

def get_antonyms(word):
    antonyms = flatten( [v.antonyms() for v in get_variants(word)] )
    return sorted( [a.name for a in antonyms] )

fight_synonyms = """action altercation argument battle bout brawl clash combat conflict confrontation
contest controversy disagreement dispute duel exchange feud match melee quarrel riot rivalry round
scuffle skirmish struggle war wrangling affray broil brush contention difficulty dissension dogfight
engagement fisticuffs fracas fray free-for-all fuss hostility joust row ruckus rumble scrap scrimmage
set-to strife tiff to-do tussle battle royal sparring match""".split()

# print sorted(list(set(fight_synonyms) - set(get_synonyms('fight'))))
#
# fight_antonyms = """accord agreement calm concord harmony peace quiet truce
# friendliness friendship kindness""".split()
#
# print sorted( list( set( fight_antonyms ) - set( get_antonyms('fight') ) ) )



for synset in wn.synsets('dog'):
    for lemma in synset.lemmas():
        print lemma.name()