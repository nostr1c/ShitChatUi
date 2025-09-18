import { useDispatch, useSelector } from "react-redux";
import { GetImageUrl } from "../utils/general";
import "./scss/ChatSettingsInvites.scss"
import { useApi } from "../services/useApi";
import { setRoomInvites } from "../redux/chat/chatSlice";
import { useRef } from "react";
import { showToast } from "../redux/toast/toastThunks";
import Button from "./Button";
import { useParams } from "react-router-dom";


function ChatSettingsInvites() {
  const { id: roomId} = useParams();
  const { roomInvites } = useSelector((state) => state.chat)
  const api = useApi();
  const validThroughRef = useRef();
  const dispatch = useDispatch();

  const fetchRoomInvites = async () => {
    try {
      const { data }  = await api.get(`invite/${roomId}`);
      if (data.data.length > 0) {
        dispatch(setRoomInvites({ room: roomId, data: data.data }));
      }
    } catch (error) {
      console.error("Error fetching room invites: ", error)
    }
  }

  // Only fetch if not already
  if (roomId && !roomInvites[roomId]) fetchRoomInvites();

  const handleCreateInvite = async () => {
    const validThrough = validThroughRef.current.value
    if (validThrough) {
      try {
        const result = await api.post(`/invite/${roomId}/`, { validThrough });
        validThroughRef.current.value = ""; 

        if (result.data.message) {
          dispatch(showToast("success", result.data.message))
        }
      } catch (error) {
        console.error("Error creating invite:", error.response.data);
      }
    }
  }

  // Date to days
  const formatDay = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Invalid";
    return days + " d";
  }

  return (
    <div className="Invites">
      <div className="Invites--New">
        <h4>New invite </h4>
        <div className="Invites--New--Form">
          <label htmlFor="">Valid through</label>
          <input
            type="date"
            ref={validThroughRef}
            min={new Date().toISOString().split("T")[0]}
          />
          <Button
            onClick={handleCreateInvite}
          >
            Create
          </Button>
        </div>

      </div>
      <table className="InviteTable">
        <thead>
          <tr>
            <th className="Creator">Creator</th>
            <th className="Code">Code</th>
            <th className="Valid">Valid</th>
          </tr>
        </thead>
        <tbody>
          {
            roomInvites[roomId] && roomInvites[roomId].length > 0 ? (
              roomInvites[roomId].map((invite) => (
              <tr key={invite.inviteString}>
                <td className="Creator">
                  <img
                    src={GetImageUrl(invite.creator.avatar)}
                  />
                  <p>{invite.creator.username}</p>
                </td>
                <td>
                  <div className="Code">
                    https://filipsiri.se/{invite.inviteString}
                  </div>
                </td>
                <td>
                  {formatDay(invite.validThrough)}
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td>No found</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default ChatSettingsInvites;