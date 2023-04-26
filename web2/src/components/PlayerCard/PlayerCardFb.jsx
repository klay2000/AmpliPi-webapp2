import Card from "@/components/Card/Card"
import StreamBadge from "@/components/StreamBadge/StreamBadge"
import SongInfo from "../SongInfo/SongInfo"
import CardVolumeSlider from "../CardVolumeSlider/CardVolumeSlider"
import { useState } from "react"
import PlayerImage from "../PlayerImage/PlayerImage"
import ZonesBadge from "../ZonesBadge/ZonesBadge"
import StreamsModal from "../StreamsModal/StreamsModal"
import ZonesModal from "../ZonesModal/ZonesModal"
import { useStatusStore } from "@/App.jsx"
import { router } from "@/main"
import './PlayerCardFb.scss'
import Chip from '@/components/Chip/Chip'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from "@mui/material"

const PlayerCardFb = ({ sourceId }) => {
  const [streamModalOpen, setStreamModalOpen] = useState(false)
  const [zoneModalOpen, setZoneModalOpen] = useState(false)
  const setSelectedSource = useStatusStore((s) => s.setSelectedSource)
  const selected = useStatusStore((s) => s.selectedSource) === sourceId
  const img_url = useStatusStore((s) => s.status.sources[sourceId].info.img_url)

  const select = () => {
    if (selected) {
      router.navigate("/player")
    }

    setSelectedSource(sourceId)
  }

  const openStreams = () => {
    setStreamModalOpen(true)
  }

  const openZones = () => {
    setZoneModalOpen(true)
  }

  return (
    <Card backgroundImage={img_url} selected={selected}>
      <div className="container">
        <div className="top">
          <StreamBadge sourceId={sourceId} onClick={openStreams} />
          <IconButton
            onClick={() => {
              // TODO: close the stream/source
              // setZones()
              // setGroups()
            }}
          >
            <CloseIcon
              // className="zones-modal-button-icon"
              style={{ width: "2rem", height: "2rem" }}
            />
          </IconButton>
        </div>
        <div className="content">
          <div className="zones">
            <ZonesBadge sourceId={sourceId} onClick={openZones} />
          </div>
          <SongInfo sourceId={sourceId} />
        </div>
        <CardVolumeSlider
          sourceId={sourceId}
          onChange={(event, vol) => {
            setVol(sourceId, event, vol)
          }}
        />
      </div>

      {streamModalOpen && (
          <StreamsModal
            sourceId={sourceId}
            setStreamModalOpen={setStreamModalOpen}
            onClose={() => setStreamModalOpen(false)}
          />
        )}
        {zoneModalOpen && (
          <ZonesModal
            sourceId={sourceId}
            setZoneModalOpen={setZoneModalOpen}
            onClose={() => setZoneModalOpen(false)}
          />
        )}
    </Card>
  )
}

export default PlayerCardFb
