import { GetImageUrl } from "../utils/general";
import "../pages/scss/Chat.scss";

function MessageItem({ message, currentUser, member, isMessageStart }) {

  const classes = []
  if (currentUser.id == message.userId) classes.push("Self");
  if (!isMessageStart) classes.push("Same");

  return (
    <div className={`Message ${classes.join(" ")}`} key={message.id}>
      {isMessageStart && (
        <img className="Message--Avatar" src={GetImageUrl(member?.user?.avatar ?? message.userName)} alt="avatar" />
      )}
      <div className="Message--Content">
        <div className="Message--Content--Top">
          {isMessageStart && (
            <p className="Message--Content--Top--Name">{member?.user?.username ?? message.userName}</p>
          )}
          <p className="Message--Content--Top--Date">{new Date(message.createdAt).toLocaleString()}</p>
        </div>
        <div className="Message--Content--Text">{message.content}</div>
      </div>
    </div>
  );
}
export default MessageItem;