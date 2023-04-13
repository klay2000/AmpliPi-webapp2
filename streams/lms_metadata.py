#!/usr/bin/python3
"""LMS Metadata"""

import json
import time
import requests

class LMSMetadataReader:
  """A class for getting metadata from a Logitech Media Server."""

  def __init__(self, name: str, meta_ref: int):
    self.player_name = name
    self.IP = None
    self.meta_ref_rate = meta_ref
    self.connected = False
    self.metadata = {'title': 'Loading...', 'artist': 'Loading...', 'album': 'Loading...', 'album_art': 'static/imgs/lms.png'}


  def connect(self):
    """Discovers LMS Player and then requests metadata repetitively"""
    x = 0
    reqtime = 0.001
    while self.IP is None and reqtime < 100:
      if x > 256:
        x = 0
        reqtime = reqtime * 10
      try:
        track_json = {"id": 1, "method": "slim.request", "params": [ self.player_name, ["status", "-",100] ]}
        track_info = requests.post(f'http://192.168.0.{x}:9000/jsonrpc.js 2>/dev/null', json=track_json, timeout=reqtime)
        track_load = json.loads(track_info.text)
        stream_name = track_load['result']['player_name']
        print(f"This host DOES have an LMS Client: 192.168.0.{x} <---------------")
        print(f"stream_name: {stream_name}")
        print(f"player_name: {self.player_name}")
        if self.player_name == stream_name:
          self.IP = f"192.168.0.{x}"
      except:
        print(f"This host has no LMS Client: 192.168.0.{x}")
        x+=1

    while self.connected == False:
      try:
        player_json = {"id": 1,	"method": "slim.request",	"params": ["Steve Live Tester", ["players", "-", 100, "playerid"]]}
        player_info = requests.get(f'http://{self.IP}:9000/jsonrpc.js', json=player_json, timeout=10)
        player_load = json.loads(player_info.text)
        players = player_load['result']['players_loop']
        pd = open("playerdata.json", "w")
        json.dump(player_load, pd, indent = 2)

        for player in players:
          connected = player['connected']
          if connected and player['name'] == self.player_name:
            print(f"Connected to: {player['name']}")
            self.connected = True
          else:
            print(f"Skipped connection to: '{player['name']}'\nReason: expected player is called '{self.player_name}'")
            time.sleep(0.1)
      except:
        # When first creating an LMS stream, there can be random errors that will close the while loop
        # typically when asking the player for info when there isn't a player linked to the stream yet
        None

    while self.connected == True:
      track_json = {"id": 1, "method": "slim.request", "params": [ self.player_name, ["status", "-",100] ]}
      track_info = requests.post(f'http://{self.IP}:9000/jsonrpc.js 2>/dev/null', json=track_json, timeout=200)
      track_load = json.loads(track_info.text)

      track_id = track_load["result"]["playlist_loop"][0]["id"]
      song_json = {"id":2,"method":"slim.request","params":[ self.player_name, ["songinfo","-",100,f"track_id:{track_id}"]]}
      song_info = requests.post(f'http://{self.IP}:9000/jsonrpc.js 2>/dev/null', json=song_json, timeout=200)
      song_load = json.loads(song_info.text)

      x = 0
      song_data = {}
      for item in song_load["result"]["songinfo_loop"]:
        for info in item:
          song_data[info] = song_load['result']['songinfo_loop'][x][info]
        x += 1

      x = 0
      track_data = {}
      for item in track_load["result"]["playlist_loop"]:
        for info in item:
          track_data[info] = track_load['result']['playlist_loop'][x][info]
        x += 1

      meta = {
        'title': 'Loading...',
        'artist': 'Loading...',
        'album': 'Loading...',
        'album_art': 'static/imgs/lms.png'
       }

      if song_data['type'] == "MP3 Radio" or song_data['type'] == "AAC Radio" or song_data['type'] == "Radio":
        meta["title"] = track_data["title"]
        meta['artist'] = None
        meta['album'] = song_data['remote_title']
        meta["album_art"] = f"http://{self.IP}:9000/music/{song_data['coverid']}/cover.jpg?id={song_data['coverid']}"
        # meta['album_art'] = 'static/imgs/lms.png'
        print(f"http://{self.IP}:9000/music/cover.jpg?id={song_data['coverid']}")

      elif song_data['type'] == "MP3 (Pandora)":
        try:
          meta["title"] = song_data["title"]
          meta["artist"] = song_data["artist"]
          meta["album"] = song_data["album"]
          meta["album_art"] = song_data["artwork_url"]
        except KeyError:
          # Sometimes, KeyError will occur when switching to pandora from a different stream type since the json that LMS sends is formatted differently
          print(f"KeyError, trying again in {self.meta_ref_rate} seconds...")

          meta["title"] = song_data["title"]
          meta["album_art"] = song_data["artwork_url"]

        self.metadata = meta
        print(f"Metadata: {meta}")
      time.sleep(self.meta_ref_rate)
