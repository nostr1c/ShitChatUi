import { useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import "./scss/ChatSettingsGeneral.scss";
import Button from "./Button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import ValidationErrorList from "./ValidationErrorList";

function ChatSettingsGeneral() {
  const api = useApi();
  const { id: roomId } = useParams();
  const room = useSelector((state) => state.chat.rooms[roomId]);
  const [errors, setErrors] = useState(null);

  const [formData, setFormData] = useState({
    name: room.name,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({...prev, [key]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.length < 2) {
      setErrors({ Name: ["ErrorGroupNameMinLength"] });
      return;
    }

    try {
      let result = await api.put(`/group/${roomId}`, formData)
      toast.success(result.data.message);
      setErrors(null);
    } catch (error) {
      console.log(error)
      const response = error.response.data;
      if (response.hasErrors) {
        setErrors(response.errors)
        toast.error(response.message)
      }
    }
  }

  return (
    <div className="ChatSettingsGeneral">
      <h4>Group settings</h4>
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
  )
}

export default ChatSettingsGeneral;