import "./VolumesZones.scss"
import { useStatusStore } from "@/App.jsx"
import { getSourceZones } from "@/pages/Home/Home"
import ZoneVolumeSlider from "../ZoneVolumeSlider/ZoneVolumeSlider"
import GroupVolumeSlider from "../GroupVolumeSlider/GroupVolumeSlider"
import Card from "../Card/Card"

const VolumeZones = ({ sourceId }) => {
  const zones = getSourceZones(sourceId, useStatusStore.getState().status.zones)
  const groups = getSourceZones(
    sourceId,
    useStatusStore.getState().status.groups
  )

  const ZoneVolumeSliders = []
  const GroupVolumeSliders = []

  for (const group of groups) {
    if (group.source_id == sourceId) {
      GroupVolumeSliders.push(
        <Card className="group-vol-card" key={group.id}>
          <GroupVolumeSlider groupId={group.id} />
        </Card>
      )
    }
  }

  for (const zone of zones) {
    let grouped = false

    for (const group of groups) {
      if (group.zones.includes(zone.id)) {
        grouped = true
      }
    }
    if (!grouped) {
      ZoneVolumeSliders.push(
        <Card className="zone-vol-card" key={zone.id}>
          <ZoneVolumeSlider zoneId={zone.id} />
        </Card>
      )
    }
  }

  return (
    <div className="volume-sliders-container">
      {GroupVolumeSliders}
      {ZoneVolumeSliders}
    </div>
  )
}

export default VolumeZones
