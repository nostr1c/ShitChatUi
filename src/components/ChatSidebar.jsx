import { GetImageUrl } from "../utils/general";
import "./scss/ChatSidebar.scss"
import { FaCrown } from "react-icons/fa6";

function ChatSidebar(props) {

  return (
    <div className="Members">
     {props.members && props.members.length > 0 ? (
        props.members.map((member) => (
          <div key={member.user.id} className="Members--Child">
            <img 
              src={GetImageUrl(member.user.avatar)}
            />
             <p>{member.user.username}</p>  
             {member.user.id == props.room?.ownerId ? (<FaCrown />) : null}
          </div> 
         ))
       ) : null}
    </div>
  )
}

export default ChatSidebar;