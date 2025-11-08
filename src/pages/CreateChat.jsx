import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { pushRoom } from "../redux/chat/chatSlice";
import { signalRService } from "../services/signalRService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ValidationErrorList from "../components/ValidationErrorList";

function CreateChat() {
  const [formBody, setFormBody] = useState({ name: "" });
  const translations = useSelector((state) => state.translations.english);
  const dispatch = useDispatch()
  const api = useApi();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var result = await api.post("/group", formBody);
      const newRoom = result.data.data;
      dispatch(pushRoom(newRoom));

      await signalRService.invoke("JoinGroup", newRoom.id);
      console.log(`Joined room: ${newRoom.id}`);  
      
      if (result.data.message) {
        toast.success(translations[result.data.message]);
      }

      navigate(`/chat/${newRoom.id}`);

    } catch (error) {
      if (error.response.data.hasErrors) {
        const errors = error.response.data.errors;
        setErrors(errors);
      }
    }
  };

  return (
    <>
      <div className="Form-Wrapper">
        <div className="Form">
          <h1>Create a new room</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Room name
              <input
                type="text"
                placeholder="My awesome room"
                value={formBody.name}
                onChange={(e) => setFormBody({ ...formBody, name: e.target.value })}
              />
            </label>

            {errors && <ValidationErrorList
              errors={errors.Name}
            />}
            
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateChat;