#!/usr/bin/python3
"""LMS Metadata"""

import json
import socket
import requests
import time


hostname = socket.gethostname() #TODO: Find which LMS server is attached to client instead
# IP = socket.gethostbyname(hostname)


class LMSMetadataReader:
  """A class for getting metadata from a Logitech Media Server."""

  def __init__(self, name: str, ip: str, macaddr: str, meta_ref: int):
    self.stream_name = str(name).replace(" ", "_")
    self.IP = ip
    self.MAC = macaddr
    self.meta_ref_rate = meta_ref

    self.get_metadata()


  def get_metadata(self): #TODO: Get better metadata from non-pandora sources
    """Gets metadata from the LMS player"""
    while True:
      track_json = {"id": 1, "method": "slim.request", "params": [ self.MAC, ["status", "-",100] ]}
      track_info = requests.post(f'http://{self.IP}:9000/jsonrpc.js 2>/dev/null', json=track_json, timeout=200)
      track_load = json.loads(track_info.text)
      # print(f"Track Data: {track_info}")
      track_id = track_load["result"]["playlist_loop"][0]["id"]
      song_json = {"id":2,"method":"slim.request","params":[ self.MAC, ["songinfo","-",100,f"track_id:{track_id}"]]}
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
        print(f"http://{self.IP}:9000/music/cover.jpg?id={song_data['coverid']}")

      elif song_data['type'] == "MP3 (Pandora)":
        try:
          meta["title"] = song_data["title"]
          meta["artist"] = song_data["artist"]
          meta["album"] = song_data["album"]
          meta["album_art"] = song_data["artwork_url"]
          print(song_data["artwork_url"])
        except KeyError:
          print("KeyError, trying again in 2 seconds...")

          meta["title"] = song_data["title"]
          meta["album_art"] = song_data["artwork_url"]

      print(f"Temp: {meta}")

      self.metadata = meta

      time.sleep(self.meta_ref_rate)

# print(lms.stream_name)
# print(lms.get_metadata)
