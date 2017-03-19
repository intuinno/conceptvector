import tweepy

CONSUMER_KEY = 'kO5cBy0Cley4AhojZbTaI7hcs'
CONSUMER_SECRET = '03VUjqm5VQdnzupMMnDrDeFceSoXGYOeIhSnljKfrXGexJSiEZ'
ACCESS_TOKEN = '38975687-neMtWsyv7uXwAZOgW9NShDPzYsXaCsqdvMkWDTwgG'
ACCESS_TOKEN_SECRET = 'vCdIijwpiki13vu17hT5vupztSwVj68yBZmh8XIFnpgNq'

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

api = tweepy.API(auth)

class StreamListener(tweepy.StreamListener):

    def on_status(self, status):
        # import ipdb; ipdb.set_trace()
        if status.retweeted:
            return
        print status.coordinates

    def on_error(self, status_code):
        if status_code == 420:
            return False

stream_listener = StreamListener()
stream = tweepy.Stream(auth=api.auth, listener=stream_listener)
stream.filter(track=['trump','clinton', 'hillary clinton', 'donald trump'])

