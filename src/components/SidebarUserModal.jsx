import { GetImageUrl } from "../utils/general";
import "./scss/SidebarUserModal.scss"

function SidebarUserModal(props) {
  return (
      <div
        className="MemberModal"
        style={{ 
          top: `${props.modalPosition}px`
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
            <h3>
              @{props?.member?.user.username}
            </h3>
            <div className="ModalContent--Roles">
              {
                props?.member?.roles.map((role) => (
                  <div key={role.id} className="ModalContent--Roles--Child">
                    <div style={{backgroundColor: `#${role.color}`}}></div>
                    <p>{role.name}</p>
                  </div>
                ))
              }
            </div>
        </div>
    </div>
  )
}

export default SidebarUserModal;