import "./Settings.scss"
import Modal from "@/components/Modal/Modal"
import Streams from "./Streams/Streams"
import Zones from "./Zones/Zones"
import Groups from "./Groups/Groups"
import Sessions from "./Sessions/Sessions"
import Presets from "./Presets/Presets"
import Config from "./Config/Config"
import About from "./About/About"
import { router } from "@/main"

const PageListItem = ({ name, onClick }) => {
  return (
    <div className="settings-list-item" onClick={onClick}>
      {name}
    </div>
  )
}

const close = () => router.navigate("/settings")

const CorePage = ({ openPage }) => {
  switch (openPage) {
    case "streams":
      return <Streams onClose={close} />
    case "zones":
      return <Zones onClose={close} />
    case "groups":
      return <Groups onClose={close} />
    case "sessions":
      return <Sessions onClose={close} />
    case "presets":
      return <Presets onClose={close} />
    case "config":
      return <Config onClose={close} />
    case "about":
      return <About onClose={close} />
    default:
      return <div></div>
  }
}

// wrap in modal if page is open
const Page = ({ openPage }) =>
  openPage === "" ? (
    <div />
  ) : (
    <Modal onClose={close}>
      <div className="settings-page-container">
        <CorePage openPage={openPage} />
      </div>
    </Modal>
  )

const Settings = ({ openPage = "" }) => {
  return (
    <div className="settings-outer">
      <div className="settings-header">Settings</div>
      <div className="settings-body">
        <PageListItem
          name="Streams"
          onClick={() => router.navigate("/settings/streams")}
        />
        <PageListItem
          name="Zones"
          onClick={() => router.navigate("/settings/zones")}
        />
        <PageListItem
          name="Groups"
          onClick={() => router.navigate("/settings/groups")}
        />
        <PageListItem
          name="Sessions"
          onClick={() => router.navigate("/settings/sessions")}
        />
        <PageListItem
          name="Presets"
          onClick={() => router.navigate("/settings/presets")}
        />
        <PageListItem
          name="Configuration and Reset"
          onClick={() => router.navigate("/settings/config")}
        />
        <PageListItem
          name="Updates"
          onClick={() => {
            window.location.href =
              "http://" + window.location.hostname + ":5001/update"
          }}
        />
        <PageListItem
          name="About"
          onClick={() => router.navigate("/settings/about")}
        />
      </div>
      <Page openPage={openPage} />
    </div>
  )
}
export default Settings
