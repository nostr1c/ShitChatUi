import { GetImageUrl } from "../utils/general";
import "./scss/SidebarUserModal.scss"

function SidebarUserModal(props) {
  return (
      <div
        className="MemberModal"
        style={{ 
          left: `${props.modalPosition.x}px`,
          top: `${props.modalPosition.y}px`
        }}
      >
        <div className="ModalHeader">
          <div className="ModalHeader--Avatar">
            <img
              src={GetImageUrl(props?.member?.user.avatar)}
              draggable="false"
            />
          </div>
        </div>
        <div className="ModalContent">
            <h3>@{props?.member?.user.username}</h3>
        </div>
    </div>
  )
}

export default SidebarUserModal;