# TODO: remove this file
SERVER="192.168.0.177"
SERVERPORT="9000"
MACADDR="0d:f8:99:b4:bb:65" # player "MAC"
TRACKID=$(curl -g -X POST -d '{"id":1,"method":"slim.request","params":["'$MACADDR'",["'status'","-",1]]}' http://$SERVER:$SERVERPORT/jsonrpc.js 2>/dev/null |jq -r ".result.playlist_loop[].id")
SONGINFO=$(curl -g -X POST -d '{"id":1,"method":"slim.request","params":["'$MACADDR'",["'songinfo'","-",100,"'track_id:$TRACKID'"]]}' http://$SERVER:$SERVERPORT/jsonrpc.js 2>/dev/null)
echo $SONGINFO | jq -r  ".result.songinfo_loop[]" | jq -s add
# NOTE: url can be recovered from coverid if local
# URL=http://$SERVER:$SERVERPORT/music/$COVERID/cover.jpg
