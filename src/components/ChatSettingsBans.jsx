import { useParams } from "react-router-dom";

function ChatSettingsBans() {
  const { id: roomId} = useParams();

  return (
    <div>Bans</div>
  )
}

export default ChatSettingsBans;