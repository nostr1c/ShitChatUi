import { useSelector } from "react-redux";
import { GetImageUrl } from "../utils/general";
import "./scss/SidebarUserModal.scss"
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useApi } from "../services/useApi";

function SidebarUserModal(props) {
  const params = useParams();
  const api = useApi();

  const member = useSelector((state) => state.chat.roomMembers[params.id][props?.userId]);
  const userRoles = member.roles;
  
  const roomRoles = useSelector((state) => state.chat.roomRoles[params.id]);

  const [selectedRoles, setSelectedRoles] = useState(userRoles ?? []);

  const toggleRole = (roleId) => {
    setSelectedRoles((prev) => {
      const hasRole = prev.includes(roleId);

      if (hasRole) {
        const updated = prev.filter((id) => id !== roleId);

        api.delete(`/group/${params.id}/user/${member.user.id}/roles`, {
          data: { roleId: roleId }
        })
        .catch((error) => {
          console.error("Error removing role:", error);
          setSelectedRoles((rollback) => [...rollback, roleId]);
        });

        return updated;
      }

      const updated = [...prev, roleId];
      
      api.post(`/group/${params.id}/user/${member.user.id}/roles`, { roleId: roleId })
      .catch((error) => {
        console.error("Error adding role:", error);
        setSelectedRoles((rollback) => rollback.filter((id) => id !== roleId));
      });

      return updated;
    });
  };

  const [showUpdateUserRoles, setUpdateUserRoles] = useState(false);

  return (
      <div
        className="MemberModal"
        style={{ 
          top: `${props.modalPosition}px`
        }}
      >
      {showUpdateUserRoles && (
        <div 
          className="MemberModal--Overlay"
          onClick={() => {setUpdateUserRoles(false)}}
        ></div>
      )}
        <div className="ModalHeader">
          <div className="ModalHeader--Avatar">
            <img
              src={GetImageUrl(member.user.avatar)}
              draggable="false"
            />
          </div>
        </div>
        <div className="ModalContent">
            <h3>
              @{member.user.username}
            </h3>
            <div className="ModalContent--Roles">
              {
                userRoles.map((roleId) => {
                  const role = roomRoles?.[roleId];
                  if (!role) return null;
                  return (
                    <div className="ModalContent--Roles--Child" key={role.id}>
                      <div style={{backgroundColor: `${role.color}`}}></div>
                      <p>{role.name}</p>
                    </div>
                  )
                })
              }
              <button 
                className="ModalContent--Roles--Child Add"
                onClick={() => {setUpdateUserRoles(!showUpdateUserRoles)}}
              >
                <p>Edit roles</p>
              </button>
            </div>

            <div className="ModalContent--UpdateRoles">
              {showUpdateUserRoles && (
                Object.values(roomRoles).length > 0 ? (
                  Object.values(roomRoles).map((role) => (
                    <div
                      className="Role"
                      key={role.id}
                      onClick={() => toggleRole(role.id)}
                    >
                      <div
                        className="Role--Dot"
                        style={{ backgroundColor: `${role.color}` }}
                      />
                      <p>{role.name}</p>
                      <div className={`Role--CheckBox ${selectedRoles.includes(role.id) ? "Checked" : ""}`}>
                        {selectedRoles.includes(role.id) && <FaCheck />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="Role Empty">No roles found</div>
                )
              )}
            </div>
        </div>
    </div>
  )
}

export default SidebarUserModal;