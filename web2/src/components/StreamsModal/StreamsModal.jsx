import "./StreamsModal.scss";
import Modal from "../Modal/Modal";
import Card from "../Card/Card";
import StreamBadge from "../StreamBadge/StreamBadge";

const StreamsModal = ({ streams, setStream }) => {

  let streamsList = []

  for (const stream of streams) {
    streamsList.push(
      <div className="streams-modal-list-item" onClick={()=>{setStream(stream.id)}} key={stream.id}>
        <StreamBadge name={stream.name} type={stream.type} />
      </div>
    )
  }

  return(
    <Modal className="streams-modal">
      <Card className="streams-modal-card">
        <div className="streams-modal-header">
          Select Stream
        </div>
        <div className="streams-modal-body">
          {streamsList}
        </div>
      </Card>
    </Modal>
  )
}

export default StreamsModal
