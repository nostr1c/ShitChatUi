import { useState } from "react";
import { GetImageUrl } from "../utils/general";
import "./scss/ChatSidebar.scss"
import { FaCrown } from "react-icons/fa6";
import SidebarUserModal from "./SidebarUserModal";

function ChatSidebar(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPositionn] = useState({ x: 0, y: 0 })
  const [modalUser, setModalUser] = useState(null);

  const setModalPosition = (element) => {
    let parent = element.offsetParent;
    let rect = element.getBoundingClientRect();
    let parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
    let relativeX = rect.left - parentRect.left;
    let relativeY = rect.top - parentRect.top;
    setModalPositionn({ x: relativeX, y: relativeY })
  }

  const toggleModal = (e) => {
    let element = e.currentTarget;
    setModalPosition(element);
    setShowModal(!showModal);
  }

  return (
    <div className="Members">
      {props.members && props.members.length > 0 ? (
      props.members.map((member) => (
        <div
          key={member.user.id}
          className="Members--Child"
          onClick={(e) => {
            setModalUser(member)
            toggleModal(e);
          }}
        >
          <img 
            src={GetImageUrl(member.user.avatar)}
          />
          <div className="Members--Child--Text">
            <div className="Members--Child--Text--Name">
              <p>{member.user.username}</p>
              {member.user.id == props.room?.ownerId ? (<FaCrown />) : null}
            </div>
            {member.isTyping ? (<span>typing...</span>) : null}
          </div>
        </div> 
        ))
      ) : null}
      {showModal && modalUser ? (
        <>
          <div
            className="SidebarOverlay"
            onClick={() => setShowModal(false)}
          />
          <SidebarUserModal
            modalPosition={modalPosition}
            member={modalUser}
          />
        </>
      ) : null}
    </div>
  )
}

export default ChatSidebar;