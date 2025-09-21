import { useSelector } from "react-redux";
import { GetImageUrl } from "../utils/general";
import "./scss/SidebarUserModal.scss"
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useApi } from "../services/useApi";
import { GiWalkingBoot, GiThorHammer } from "react-icons/gi";
import PermissionGate from "./PermissionGate";

function SidebarUserModal({ modalPosition, userId, setShowModal }) {
  const { id: roomId} = useParams();
  const api = useApi();

  const user = useSelector((state) => state.auth.user);
  const member = useSelector((state) => state.chat.roomMembers[roomId][userId]);
  const roomRoles = useSelector((state) => state.chat.roomRoles[roomId]);
  const room = useSelector((state) => state.chat.rooms[roomId]);
  
  const userRoles = member?.roles ?? [];
  const [selectedRoles, setSelectedRoles] = useState(userRoles ?? []);
  const [showUpdateUserRoles, setShowUpdateUserRoles] = useState(false);

  const toggleRole = (roleId) => {
    setSelectedRoles((prev) => {
      const hasRole = prev.includes(roleId);

      // Remove role if user has it.
      if (hasRole) {
        const updated = prev.filter((id) => id !== roleId);

        api.delete(`/group/${roomId}/user/${member.user.id}/roles`, {
          data: { roleId: roleId }
        })
        .catch((error) => {
          console.error("Error removing role:", error);
          setSelectedRoles((rollback) => [...rollback, roleId]);
        });

        return updated;
      }

      // Else add it to user.
      const updated = [...prev, roleId];
      
      api.post(`/group/${roomId}/user/${member.user.id}/roles`, { roleId: roleId })
      .catch((error) => {
        console.error("Error adding role:", error);
        setSelectedRoles((rollback) => rollback.filter((id) => id !== roleId));
      });

      return updated;
    });
  };

  const handleKick = () => {
    setShowModal(false);
    api.post(`/group/${roomId}/members/${member.user.id}/kick`)
    .then((response) => {
      // console.log(response); Show toast? Confetti?
    })
    .catch((error) => {
      console.error("Error kicking user:", error);
    });
  }

  return (
      <div
        className="MemberModal"
        style={{ 
          top: `${modalPosition}px`
        }}
      >
      {showUpdateUserRoles && (
        <div 
          className="MemberModal--Overlay"
          onClick={() => {setShowUpdateUserRoles(false)}}
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
              <PermissionGate
                roomId={roomId}
                userId={user.id}
                permissions={["manage_user_roles"]}
              >
                <button 
                  className={`ModalContent--Roles--Child Add ${showUpdateUserRoles ? "Selected" : ""}`}
                  onClick={() => {setShowUpdateUserRoles(!showUpdateUserRoles)}}
                >
                  <p>Edit roles</p>
                </button>
              </PermissionGate>
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
            {user.id !== member.user.id && member.user.id !== room.ownerId && (
              <div
                className="ModalContent--Actions"
              >
                <PermissionGate
                  roomId={roomId}
                  userId={user.id}
                  permissions={["kick_user"]}
                >
                  <button
                    className="ModalContent--Actions--Child"
                    onClick={handleKick}
                  >
                    <GiWalkingBoot />
                    <p>Kick</p>
                  </button>
                </PermissionGate>
                <PermissionGate
                  roomId={roomId}
                  userId={user.id}
                permissions={["ban_user"]}
                >
                  <button
                    className="ModalContent--Actions--Child"
                  >
                    <GiThorHammer />
                    <p>Ban</p>
                  </button>
                </PermissionGate>
              </div>
            )}
        </div>
    </div>
  )
}

export default SidebarUserModal;