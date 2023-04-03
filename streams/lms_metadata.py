#!/usr/bin/python3
"""LMS Metadata"""

import json
import socket
import time
import requests
import nmap

class LMSMetadataReader:
  """A class for getting metadata from a Logitech Media Server."""

  def __init__(self, name: str, meta_ref: int):
    # self.IP = ip
    self.player_name = name
    self.IP = None
    self.meta_ref_rate = meta_ref

    # scanner = nmap.PortScanner()
    # scanner.scan(hosts="192.168.0.0/24", ports="9000", arguments="-sT -Pn -n -T5")

    # for host in scanner.all_hosts():
    x = 0
    reqtime = 0.001
    while self.IP is None:
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

    self.get_metadata()


  def get_metadata(self): #TODO: Get better metadata from non-pandora sources
    """Gets metadata from the LMS player"""
    while True:
      track_json = {"id": 1, "method": "slim.request", "params": [ self.player_name, ["status", "-",100] ]}
      track_info = requests.post(f'http://{self.IP}:9000/jsonrpc.js 2>/dev/null', json=track_json, timeout=200)
      track_load = json.loads(track_info.text)
      # print(f"Track Data: {track_info}")
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
      # print(f"Song Data: {song_data}")

      x = 0
      track_data = {}
      for item in track_load["result"]["playlist_loop"]:
        for info in item:
          track_data[info] = track_load['result']['playlist_loop'][x][info]
        x += 1
      # print(f"Track Data: {track_data}")

      meta = {
        'title': 'Loading...',
        'artist': 'Loading...',
        'album': 'Loading...',
        'album_art': 'static/imgs/lms.png'
      }

      if song_data['type'] == "MP3 Radio" or song_data['type'] == "AAC Radio" or song_data['type'] == "Radio":
        meta["title"] = track_data["title"]
        meta['artist'] = None
        meta['album'] = None
        meta["album_art"] = f"http://{self.IP}:9000/music/{song_data['coverid']}/cover.jpg?id={song_data['coverid']}"
        # meta['album_art'] = 'static/imgs/lms.png'
        print(f"http://{self.IP}:9000/music/cover.jpg?id={song_data['coverid']}")

      elif song_data['type'] == "MP3 (Pandora)":
        try:
          meta["title"] = song_data["title"]
          meta["artist"] = song_data["artist"]
          meta["album"] = song_data["album"]
          meta["album_art"] = song_data["artwork_url"]
          print(song_data["artwork_url"])
        except KeyError:
          print(f"KeyError, trying again in {self.meta_ref_rate} seconds...")

          meta["title"] = song_data["title"]
          meta["album_art"] = song_data["artwork_url"]

      print(f"Temp: {meta}")

      self.metadata = meta

      time.sleep(self.meta_ref_rate)

# lms1 = LMSMetadataReader("Steve Test", 2)
# lms2 = LMSMetadataReader("Steve Test 2", 2)
