import { useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import "./scss/ChatSettingsGeneral.scss";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import ValidationErrorList from "./ValidationErrorList";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";

function ChatSettingsGeneral() {
  const api = useApi();
  const { id: roomId } = useParams();
  const room = useSelector((state) => state.chat.rooms[roomId]);
  const translations = useSelector((state) => state.translations.english);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: room.name,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({...prev, [key]: value}))
  }

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.length < 2) {
      setErrors({ Name: ["ErrorGroupNameMinLength"] });
      return;
    }

    try {
      let result = await api.put(`/group/${roomId}`, formData)
      toast.success(translations[result.data.message]);
      setErrors(null);
    } catch (error) {
      console.log(error)
      const response = error.response.data;
      if (response.hasErrors) {
        setErrors(response.errors)
        toast.error(translations[response.message])
      }
    }
  }

  const handleDeleteSubmit = async () => {
    navigate("/");
    
    try {
      let result = await api.delete(`/group/${roomId}`)
      toast.success(translations[result.data.message]);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="ChatSettingsGeneral">
      <h4>Group settings</h4>
      <div className="ChatSettingsGeneral--Settings">
        <label>
          Group name
          <input
            type="text"
            placeholder="Group name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>
        <ValidationErrorList errors={errors?.Name} />
        <Button
          isCreate
          onClick={handleSubmit}
        >Save</Button>
      </div>

      <div className="ChatSettingsGeneral--Dangerous">
        <h4>Dangerous zone</h4>
        <label>
          Delete group
          <Button
            isDelete
            onClick={() => setShowConfirmDeleteModal(true)}
          >
            Delete
          </Button>
          {showConfirmDeleteModal && (
            <Modal
              onClose={() => setShowConfirmDeleteModal(false)}
            >
              <ConfirmationModal
                title={`Are you sure you want to delete this gorup?`} 
                subTitle="This action is permanent and cannot be undone."
                yesText="Delete server"
                noText="Cancel"
                onConfirm={handleDeleteSubmit}
                onCancel={() => setShowConfirmDeleteModal(false)}
              />
            </Modal>
          )}
        </label>
      </div>
    </div>
  )
}

export default ChatSettingsGeneral;