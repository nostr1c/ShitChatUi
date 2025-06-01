import { useState } from "react";
import { GetImageUrl } from "../utils/general";
import "./scss/ChatSidebar.scss"
import { FaCrown } from "react-icons/fa6";
import SidebarUserModal from "./SidebarUserModal";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";

function ChatSidebar(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalY, setModalY] = useState(0);
  const [modalUser, setModalUser] = useState(null);
  const params = useParams();
  const { roomMembers, roomPresence } = useSelector((state) => state.chat)

  const setModalPosition = (element) => {
    let rect = element.getBoundingClientRect();
    setModalY(rect.top)
  }

  const toggleModal = (e) => {
    let element = e.currentTarget;
    setModalPosition(element);
    setShowModal(!showModal);
  }

  return (
    <>
      <div className="Members">
      {roomMembers[params.id] ? (
        Object.values(roomMembers[params.id]).map((member) => {
          return (
            <div
              key={member.user.id}
              className="Members--Child"
              onClick={(e) => {
                setModalUser(member)
                toggleModal(e);
              }}
            >
              <div className="Members--Child--Avatar">
                <img src={GetImageUrl(member.user.avatar)} />
                {roomPresence[params.id] && roomPresence[params.id].includes(member.user.id) && (
                  <div className="Members--Child--Avatar--Presence"></div>
                )}
              </div>
              <div className="Members--Child--Text">
                <div className="Members--Child--Text--Name">
                  <p>{member.user.username}</p>
                  {member.user.id == props.room?.ownerId && <FaCrown />}
                </div>
                {member.isTyping && <span>typing...</span>}
              </div>
            </div>
          );
        })
      ) : null}
      </div>
      {showModal && modalUser ? createPortal(
        <>
          <div
            className="SidebarOverlay"
            onClick={() => setShowModal(false)}
          />
          <SidebarUserModal
            modalPosition={modalY}
            member={modalUser}
          />
        </>,
        document.getElementById("Chat-Content")
        ) : null}
    </>
  )
}

export default ChatSidebar;