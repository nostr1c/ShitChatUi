import { useParams } from "react-router-dom";
import "./scss/ManageRoleModal.scss";
import { useState } from "react";
import Button from "./Button";
import RoleSwitch from "./RoleSwitch";
import { useApi } from "../services/useApi";
import { toast } from "react-toastify";
import { handleApiErrors } from "../utils/general";
import ValidationErrorList from "./ValidationErrorList";

const availableColors = [
  "#A3BFFA", "#90CDF4", "#63B3ED", "#76E4F7", "#68D391",
  "#9AE6B4", "#F6E05E", "#FBD38D", "#F6AD55", "#F687B3",
  "#FBB6CE", "#D6BCFA", "#B794F4", "#9F7AEA", "#CBD5E0"
];

function ManageRoleModal({ closeModal, mode, role }) {
  const { id: roomId } = useParams();
  const api = useApi();
  const isCreate = mode === "create";
  const [errors, setErrors] = useState(null);

  // If not role set = create
  const [formData, setFormData] = useState({
    name: role?.name || "",
    color: role?.color || "",
    permissions: role?.permissions || []
  });

  // handle inputs and formdata
  const handleChange = (key, value) => {
    setFormData((prev) => ({...prev, [key]: value}))
  }

  // handle formdata for permissions
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
        toast.success(result.data.message);
        closeModal();
      } catch (error) {
        const response = error.response.data;
        if (response.hasErrors) {
          setErrors(response.errors)
          toast.error(response.message)
        }
      }
    } else {
      try {
        let result = await api.put(`/group/${roomId}/roles/${role.id}`, formData)
        toast.success(result.data.message);
        closeModal();
      } catch (error) {
        const response = error.response.data;
        if (response.hasErrors) {
          setErrors(response.errors)
          toast.error(response.message)
        }
      }
    }
  }

  // Space instead of "_" and uppercased
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
          <ValidationErrorList
            errors={errors?.Name}
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
          <ValidationErrorList
            errors={errors?.Color}
          />
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