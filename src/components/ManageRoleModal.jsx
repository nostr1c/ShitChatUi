import { useParams } from "react-router-dom";
import "./scss/ManageRoleModal.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Button from "./Button";
import RoleSwitch from "./RoleSwitch";
import { useApi } from "../services/useApi";
import { showToast } from "../redux/toast/toastThunks";
import { handleApiErrors } from "../utils/general";

const availableColors = [
  "#A3BFFA", "#90CDF4", "#63B3ED", "#76E4F7", "#68D391",
  "#9AE6B4", "#F6E05E", "#FBD38D", "#F6AD55", "#F687B3",
  "#FBB6CE", "#D6BCFA", "#B794F4", "#9F7AEA", "#CBD5E0"
];

function ManageRoleModal({ closeModal, mode, role }) {
  const { id: roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const api = useApi();
  const dispatch = useDispatch();
  
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    name: role?.name || "",
    color: role?.color || "",
    permissions: role?.permissions || []
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({...prev, [key]: value}))
  }

  const handlePermissionChange = (permission) => {
    setFormData((prev) => {
      const hasPermission = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: hasPermission
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission]
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCreate) {
      try {
        let result = await api.post(`/group/${roomId}/roles`, formData)
        dispatch(showToast("success", result.data.message))
        closeModal();
      } catch (error) {
        if (error.response.data.errors) {
          handleApiErrors(dispatch, error.response.data.errors)
        }
      }
    } else {
      try {
        let result = await api.put(`/group/${roomId}/roles/${role.id}`, formData)
        dispatch(showToast("success", result.data.message))
        closeModal();
      } catch (error) {
        if (error.response.data.errors) {
          handleApiErrors(dispatch, error.response.data.errors)
        }
      }
    }
  }

  const formatPermissionLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const allPermissions = [
    "kick_user",
    "ban_user",
    "delete_messages",
    "manage_invites",
    "manage_user_roles",
    "manage_server_roles",
    "manage_server"
    ];

  return (
    <div
      className="ManageRole"
    >
      <div
        className="ManageRole--Overlay"
        onClick={closeModal}
      />
      <div className="ManageRole--Content">
        <h3>{isCreate ? "Create a new role" : "Edit role"}</h3>
        <form
          className="Form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <div className="Color">
            <div
              className="Preview"
              style={{ backgroundColor: formData.color }}
            />
            <div className="Selection">
              {availableColors.map((c) => (
                <button
                  style={{backgroundColor: c}}
                  type="button"
                  key={c}
                  onClick={() => handleChange("color", c)}
                />
              ))}
            </div>
          </div>
          <div className="Permissions">
            {allPermissions.map((perm) => (
              <div className="Permissions--Child" key={perm}>
                <RoleSwitch
                  checked={formData.permissions.includes(perm)}
                  onChange={() => handlePermissionChange(perm)}
                  label={formatPermissionLabel(perm)}
                />
              </div>
            ))}
          </div>
          <div className="Buttons">
            <Button type="submit" isCreate={isCreate}>
              {isCreate ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManageRoleModal;