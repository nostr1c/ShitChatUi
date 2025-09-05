import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setRoomRoles } from "../redux/chat/chatSlice";
import { useApi } from "../services/useApi";
import "./scss/ChatSettingsRoles.scss";
import Button from "./Button";
import { useState } from "react";
import ManageRoleModal from "./ManageRoleModal";


function ChatSettingsRoles() {
  const dispatch = useDispatch();
  const api = useApi();
  const { id: roomId } = useParams();
  const roles = useSelector((state) => state.chat.roomRoles[roomId]);
  const rolesArray = roles ? Object.values(roles) : [];
  const [showManageRole, setShowManageRole] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchRoomRoles = async () => {
    try {
      const { data }  = await api.get(`group/${params.id}/roles`);
      dispatch(setRoomRoles({ room: params.id, data: data.data }));
    } catch (error) {
      console.error("Error fetching room roles: ", error)
    }
  }

  if (roomId && !roles) fetchRoomRoles();

  const closeCreateRole = () => {
    setShowManageRole(false);
    setSelectedRole(null);
    setModalMode(null);
  }

  const openCreateRole = () => {
    setModalMode("create");
    setSelectedRole(null);
    setShowManageRole(true);
  }

  const openEditRole = (role) => {
    setModalMode("edit");
    setSelectedRole(role);
    setShowManageRole(true);
  }

  return (
    <>
      <div className="Roles-Wrapper">
        <Button
          onClick={() => openCreateRole()}
        >
          Create role
        </Button>
        <div className="Roles">
          {rolesArray && rolesArray.length > 0 ? rolesArray.map((role) => {
            return (
              <button
                className="Roles--Child"
                key={role?.id}
                onClick={() => openEditRole(role)}
              >
                <div
                  className="Roles--Child--Dot"
                  style={{ backgroundColor: role?.color}}
                />
                <p>{role?.name}</p>
              </button>
            )
          }) : (
            <p className="Roles--Child">
              No roles found
            </p>
          )}
        </div>
      </div>
      {showManageRole && (
        <ManageRoleModal
          closeModal={closeCreateRole}
          mode={modalMode}
          role={selectedRole}
        />
      )}
    </>
  )
}

export default ChatSettingsRoles;