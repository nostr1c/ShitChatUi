import { useState } from "react";
import { useDispatch } from "react-redux";
import { useApi } from "../services/useApi";
import { showToast } from "../redux/toast/toastThunks";
import { pushRoom } from "../redux/chat/chatSlice";
import { signalRService } from "../services/signalRService";
import { useNavigate } from "react-router-dom";
import { handleApiErrors } from "../utils/general";

function CreateChat() {
  const [formBody, setFormBody] = useState({ name: "" });
  const dispatch = useDispatch()
  const api = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var result = await api.post("/group", formBody);
      const newRoom = result.data.data;
      dispatch(pushRoom(newRoom));

      await signalRService.invoke("JoinGroup", newRoom.id);
      console.log(`Joined room: ${newRoom.id}`);  
      
      if (result.data.message) {
        dispatch(showToast("success", result.data.message))
      }

      navigate(`/chat/${newRoom.id}`);

    } catch (error) {
      if (error.response.data.hasErrors) {
        const errors = error.response.data.errors;

        if (errors) handleApiErrors(dispatch, errors);
      }
    }
  };

  return (
    <>
      <div className="Form-Wrapper">
        <div className="Form">
          <h1>Create a new room</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Room name"
              value={formBody.name}
              onChange={(e) => setFormBody({ ...formBody, name: e.target.value })}
            />
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateChat;