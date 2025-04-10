import { useDispatch, useSelector } from "react-redux";
import { GetImageUrl } from "../utils/general";
import "./scss/ChatSettingsInvites.scss"
import { useApi } from "../services/useApi";
import { setRoomInvites } from "../features/chat/chatSlice";
import { useRef } from "react";
import { showToast } from "../features/toast/toastThunks";

function ChatSettingsInvites({params}) {
  const { roomInvites } = useSelector((state) => state.chat)
  const api = useApi();
  const validThroughRef = useRef();
  const dispatch = useDispatch();

  const fetchRoomInvites = async () => {
    try {
      const { data }  = await api.get(`invite/${params.id}`);
      if (data.data.length > 0) {
        dispatch(setRoomInvites({ room: params.id, data: data.data }));
      }
    } catch (error) {
      console.error("Error fetching room invites: ", error)
    }
  }

  if (params.id && !roomInvites[params.id]) fetchRoomInvites();

  const handleCreateInvite = async () => {
    const validThrough = validThroughRef.current.value
    if (validThrough) {
      try {
        const result = await api.post(`/invite/${params.id}/`, { validThrough });
        validThroughRef.current.value = ""; 

        if (result.data.message) {
          dispatch(showToast("success", result.data.message))
        }
      } catch (error) {
        console.error("Error creating invite:", error);
      }
    }
  }

  const formatDay = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="Invites">
      <h4 className="Invites--Title">Invites</h4>
      <div className="Invites--New">
        <h4>Create invite</h4>
        <div className="Invites--New--Form">
          <label htmlFor="">Valid through</label>
          <input
            type="date"
            ref={validThroughRef}
            min={new Date().toISOString().split("T")[0]}
          />
          <button
            onClick={handleCreateInvite}
          >
            Create
          </button>
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
            roomInvites[params.id] && roomInvites[params.id].length > 0 ? (
              roomInvites[params.id].map((invite) => (
              <tr key={invite.inviteString}>
                <td className="Creator">
                  <img
                    src={GetImageUrl(invite.creator.avatar)}
                  />
                  <p>{invite.creator.username}</p>
                </td>
                <td>
                  <div className="Code">
                    {invite.inviteString}
                  </div>
                </td>
                <td>
                  {formatDay(invite.validThrough)}d
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