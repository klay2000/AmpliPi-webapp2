#!/usr/bin/python3
"""LMS Metadata"""


import sys
import re
import os
import requests
import time
import socket
import json


hostname = socket.gethostname() #TODO: Find which LMS server is attached to client instead
# IP = socket.gethostbyname(hostname)
IP = "192.168.0.177"
MAC = "0d:f8:99:b4:bb:65"

METADATA_REFRESH_RATE = 2

class LMSMetadataReader:
  """A class for getting metadata from a Logitech Media Server."""

  def __init__(self):
    track_json = {"id": 1, "method": "slim.request", "params": [ MAC, ["status", "-",1] ]}
    track_request = requests.post(f'http://{IP}:9000/jsonrpc.js 2>/dev/null', json=track_json, timeout=2000)
    track_data = json.loads(track_request.text)
    print(f"Track Data: {track_data}")
    track_id = track_data["result"]["playlist_loop"][0]["id"]
    song_info = requests.post(f'http://{IP}:9000/jsonrpc.js 2>/dev/null', json={"id":1,"method":"slim.request","params":[ MAC, ["songinfo","-",100,f"track_id:{track_id}"]]}, timeout=200)

    load = json.loads(song_info.text)


    #  This only works for pandora
    # title = load["result"]["songinfo_loop"][1]["title"]
    # artist = load["result"]["songinfo_loop"][2]["artist"]
    # album = load["result"]["songinfo_loop"][6]["album"]

    # tempjson = {
    #   "song": title,
    #   "album": album,
    #   "artist": artist
    # }


    # print(f"Track: {title}")
    # print(f"Track ID: {track_id}")
    # print(f"Song Content: {song_info.text}")

    a = open("lms_meta(1).json", "w")
    a.write(str(track_data))
    f = open("lms_meta(2).json", "w")
    f.write(song_info.text)


foo = LMSMetadataReader()
