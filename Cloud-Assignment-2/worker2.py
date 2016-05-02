from multiprocessing import Pool, TimeoutError
import time
import os
import traceback
import json
import boto.sqs
import boto.sns
from boto.sqs.message import Message
import sys
from alchemyapi_python.alchemyapi import AlchemyAPI


alchemyapi = AlchemyAPI()

sqs = boto.sqs.connect_to_region("us-west-2")
myQueue = sqs.create_queue("cloud_pr2_hp")

mysns = boto.sns.connect_to_region("us-west-2")
topicarn = "Topic-ARN"


def do_alchemy(tweet_message):
    print "start"    
    sys.stdout.flush()
    tweet = json.loads(tweet_message)
    response = alchemyapi.sentiment('text', tweet["status"])
    if 'docSentiment' in response.keys():
	tweet['sentiment'] = response['docSentiment']
    	pub = mysns.publish(topicarn, json.dumps(tweet))
    sys.stdout.flush()

if __name__ == '__main__':
    pool = Pool(processes=5)              # start 4 worker processes

    while(True):
        msgs = myQueue.get_messages(5)
#        print msgs
        pool.map(do_alchemy, [m.get_body() for m in msgs])
        for m in msgs:
            myQueue.delete_message(m)
        time.sleep(.5)
