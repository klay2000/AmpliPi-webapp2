import PlayerCard from "@/components/PlayerCard/PlayerCard"
import PlayerCardFb from "@/components/PlayerCard/PlayerCardFb"
import "./Home.scss"
import { useStatusStore } from "@/App.jsx"
import ZonesModal from "@/components/ZonesModal/ZonesModal"
import StreamsModal from "@/components/StreamsModal/StreamsModal"
import PresetsModal from "@/components/PresetsModal/PresetsModal"
import { useState } from "react"

export const getSourceZones = (source_id, zones) => {
  let matches = []
  for (const i of zones) {
    if (i.source_id == source_id) {
      matches.push(i)
    }
  }
  return matches
}

const PresetAndAdd = ({cards, nextAvailableSource, setPresetsModalOpen, sources, initSource}) => {
  if (cards.length < sources.length) {
    return (
      <div className="home-presets-container">
        <div
          className="home-add-player-button"
          onClick={() => {
            initSource(nextAvailableSource)
          }}
        >
          +
        </div>
        <div style={{ width: "1.25rem" }} />
        <div
          className="home-presets-button"
          onClick={() => setPresetsModalOpen(true)}
        >
          Presets
        </div>
      </div>
    )
  } else {
    return (
      <div
        className="home-presets-button"
        onClick={() => setPresetsModalOpen(true)}
      >
        Presets
      </div>
    )
  }
}

const Home = ({}) => {
  const sources = useStatusStore((s) => s.status.sources)
  const clearSourceZones = useStatusStore((s) => s.clearSourceZones)
  const [zonesModalOpen, setZonesModalOpen] = useState(false)
  const [streamsModalOpen, setStreamsModalOpen] = useState(false)
  const [presetsModalOpen, setPresetsModalOpen] = useState(false)
  
  let cards = []
  let nextAvailableSource = null

  sources.forEach((source, i) => {
    if (
      source.input.toUpperCase() != "NONE" &&
      source.input != "" &&
      source.input != "local"
    ) {
      cards.push(
        <PlayerCardFb
          key={i}
          sourceId={source.id}
        />
      )
    } else {
      nextAvailableSource = source.id
    }
  })

  const initSource = (sourceId) => {
    // clear source zones
    clearSourceZones(sourceId)

    // open first modal
    // setZonesModalOpen(true) // TODO: change to stream modal
    setStreamsModalOpen(true)
  }

  return (
    <div className="home-outer">
      <div className="home-view">
        {cards}
        <PresetAndAdd cards={cards} nextAvailableSource={nextAvailableSource} setPresetsModalOpen={setPresetsModalOpen} sources={sources} initSource={initSource} />
      </div>

      {zonesModalOpen && (
        <ZonesModal
          sourceId={nextAvailableSource}
          setZoneModalOpen={(o) => {
            // setStreamsModalOpen(!o)
            setZonesModalOpen(o)
          }}
          onClose={() => setZonesModalOpen(false)}
        />
      )}
      {streamsModalOpen && (
        <StreamsModal
          sourceId={nextAvailableSource}
          setStreamModalOpen={(o) => {
            setZonesModalOpen(!o)
            setStreamsModalOpen(o)
          }}
          onClose={() => setStreamsModalOpen(false)}
        />
      )}
      {presetsModalOpen && (
        <PresetsModal onClose={() => setPresetsModalOpen(false)} />
      )}
    </div>
  )
}

export default Home
