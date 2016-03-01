from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import tweepy

import pickle


# apikey = ...
# apisecret = ...
# accesstoken = ...
# accesssecret = ...
execfile("../creds.py")


class MyStreamListener(tweepy.StreamListener):

	def on_status(self, status):
		# print status
		# print type(status)
		print(status.text.encode("ascii","ignore"))
		print status.id
		print status.author.name.encode("ascii","ignore")
		# pickle.dump(status,open("status.p","wb"))


mysl = MyStreamListener()
auth = OAuthHandler(apikey, apisecret)
auth.set_access_token(accesstoken, accesssecret)
stream = Stream(auth, mysl)
try:
	stream.filter(track=['python', 'javascript', 'ruby'])
except:
	print "\n\n\n"




