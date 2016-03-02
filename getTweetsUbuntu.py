from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import tweepy
import elasticsearch
import sys
# import pickle
from shapely.geometry import Polygon


es = elasticsearch.Elasticsearch([{'host': "search-twittmaphp-dpcjeguwxycdft3yapcjkcsymi.us-west-2.es.amazonaws.com",'port':80, 'use_ssl':False}])

# apikey = ...
# apisecret = ...
# accesstoken = ...
# accesssecret = ...
execfile("creds.py")

i_d = 0
class MyStreamListener(tweepy.StreamListener):

	def on_status(self, status):
		global i_d
		author = status.author.name
		text = status.text
		tweetId = status.id
		lt = [tuple(l) for l in status.place.bounding_box.coordinates[0]]
		polygon = Polygon(lt)
		lat = polygon.centroid.y
		lon = polygon.centroid.x
		es.index(index='tweets',doc_type='status',id=i_d,body={'author': author,'status': text,'tweetId': tweetId,'longitude': lon,'latitude': lat})
		i_d += 1
		# print "lat", lat
		# print "lon", lon

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




