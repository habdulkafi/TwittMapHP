from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import tweepy
import sys
from shapely.geometry import Polygon
import time
import traceback
import json
import boto.sqs
from boto.sqs.message import Message
import traceback


# apikey = ""
# apisecret = ""
# accesstoken = ""
# accesssecret = ""
execfile("creds.py")
sqs = boto.sqs.connect_to_region("us-west-2")
myQueue = sqs.create_queue("cloud_pr2_hp")


begtime = time.time()
class MyStreamListener(tweepy.StreamListener):

	def on_status(self, status):
		if status.place:
			author = status.author.name
			text = status.text
			tweetId = status.id
			lt = [tuple(l) for l in status.place.bounding_box.coordinates[0]]
			polygon = Polygon(lt)
			lat = polygon.centroid.y
			lon = polygon.centroid.x
			tweetdict = dict(author=author,status=text,tweetId=tweetId,longitude=lon,latitude=lat)
			tosend = json.dumps(tweetdict)
			sqs.send_message(myQueue, tosend)
			print "got message!"
		else:
			pass


mysl = MyStreamListener()
auth = OAuthHandler(apikey, apisecret)
auth.set_access_token(accesstoken, accesssecret)
stream = Stream(auth, mysl)
stream.filter(languages=["en"],track=["keanu","angry birds","warriors","prince","columbia"])





