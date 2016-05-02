#!/usr/bin/env python

# from __future__ import print_function
from alchemyapi import AlchemyAPI
import json

alchemyapi = AlchemyAPI()


two_people = "C:/Users/husam/Downloads/11430249_10206846582226070_4444383423738402524_n.jpg"

samljack = "C:/Users/husam/Downloads/aKq4MXO_700b_v1.jpg"


# Returns a bounding box for the faces in the picture
# response = alchemyapi.faceTagging('image', two_people)
# response = alchemyapi.faceTagging('image', samljack)


# response = alchemyapi.imageTagging('image', two_people)
response = alchemyapi.imageTagging('image', samljack)



print response



