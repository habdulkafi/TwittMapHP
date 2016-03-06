from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import tweepy
import elasticsearch
import sys
# import pickle

# es.index(index='posts', doc_type='blog', id=1, body={
#     'author': 'Santa Clause',
#     'blog': 'Slave Based Shippers of the North',
#     'title': 'Using Celery for distributing gift dispatch',
#     'topics': ['slave labor', 'elves', 'python',
#                'celery', 'antigravity reindeer'],
#     'awesomeness': 0.2
# })
# apikey = ...
# apisecret = ...
# accesstoken = ...
# accesssecret = ...
execfile("../creds.py")


class MyStreamListener(tweepy.StreamListener):

	def on_status(self, status):
		# print status
		# print type(status)
		# print(status.text.encode("ascii","ignore"))
		# print status.id
		# print status.author.name.encode("ascii","ignore")
		# pickle.dump(status,open("status.p","wb"))
		author = status.author.name
		text = status.text
		tweetId = status.id
		print [tuple(l) for l in status.place.bounding_box.coordinates[0]]
		sys.exit()



mysl = MyStreamListener()
auth = OAuthHandler(apikey, apisecret)
auth.set_access_token(accesstoken, accesssecret)
stream = Stream(auth, mysl)
# try:
# stream.filter(track=['python', 'javascript', 'ruby'])
stream.filter(locations=[-180,-90,180,90])

# except:
	# print "\n\n\n"




