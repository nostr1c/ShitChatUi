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
  const [modalUserId, setModalUserId] = useState(null);
  const params = useParams();
  const roomMembers = useSelector((state) => state.chat.roomMembers[params.id]);
  const roomPresence = useSelector((state) => state.chat.roomPresence[params.id]);

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
      {roomMembers ? (
        Object.values(roomMembers).map((member) => {
          const isOnline = roomPresence?.includes(member.user.id);
          
          return (
            <div
              key={member.user.id}
              className="Members--Child"
              onClick={(e) => {
                setModalUserId(member.user.id)
                toggleModal(e);
              }}
            >
              <div className="Members--Child--Avatar">
                <img src={GetImageUrl(member.user.avatar)} />
                {isOnline && (
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
      {showModal && modalUserId ? createPortal(
        <>
          <div
            className="SidebarOverlay"
            onClick={() => setShowModal(false)}
          />
          <SidebarUserModal
            modalPosition={modalY}
            userId={modalUserId}
            setShowModal={setShowModal}
          />
        </>,
        document.getElementById("Chat-Content")
        ) : null}
    </>
  )
}

export default ChatSidebar;