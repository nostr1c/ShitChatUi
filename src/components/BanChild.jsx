import "./scss/ChatSettingsBans.scss";
import { GetImageUrl } from "../utils/general";

function BanChild({ ban, ...props }) {
  const user = ban.userDto;
  return (
    <div {...props} className="Bans--Child">
      <img
        src={GetImageUrl(user.avatar)}
        className="Bans--Child--Avatar"
      />
      <p>{user.username}</p>
    </div>
  )
}

export default BanChild;