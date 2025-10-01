import { useDispatch, useSelector } from "react-redux";
import { GetImageUrl } from "../utils/general";
import "./scss/ChatSettingsInvites.scss"
import { useApi } from "../services/useApi";
import { setRoomInvites } from "../redux/chat/chatSlice";
import { useState } from "react";
import Button from "./Button";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ValidationErrorList from "./ValidationErrorList";
import { MdDeleteOutline } from "react-icons/md";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";

function ChatSettingsInvites() {
  const { id: roomId} = useParams();
  const { roomInvites } = useSelector((state) => state.chat)
  const api = useApi();
  const [validThrough, setValidThrough] = useState("");
  const [errors, setErrors] = useState(null);
  const dispatch = useDispatch();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [inviteToDelete, setInviteToDelete] = useState(null);

  const fetchRoomInvites = async () => {
    try {
      const { data } = await api.get(`group/${roomId}/invites`);
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
    if (validThrough) {
      try {
        const result = await api.post(`group/${roomId}/invites`, { validThrough });
        setValidThrough("");
        setErrors(null);

        if (result.data.message) {
          toast.success(result.data.message)
        }
      } catch (error) {
        const response = error.response.data;
        console.error("Error creating invite:", response.data);
        if (response.hasErrors) {
          setErrors(response.errors);
          toast.error(response.message || "Error creating invite");
        }
      }
    }
  }

  const handleDeleteInvite = async (invite) => {
    setShowConfirmDeleteModal(false);

    try {
      const result = await api.delete(`group/${roomId}/invites/${invite.id}`);
      if (result.data.message) {
        toast.success(result.data.message)
      }
    } catch (error) {
      if (response.hasErrors) 
        toast.error(response.message || "Error deleting invite");
    }
  }

  // Date to days
  const formatDay = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;

    if (diff < 0) return "Invalid";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    let result = "";
    if (days > 0) result += days + "d ";
    if (hours > 0) result += hours + "h";

    return result.trim() || "0h";
  };

  function handleClickInviteCode(code) {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    toast.success("Copied to clipboard")
  }

  return (
    <div className="Invites">
      <div className="Invites--New">
        <h4>New invite </h4>
        <div className="Invites--New--Form">
          <label htmlFor="">Valid through</label>
          <input
            type="date"
            value={validThrough}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setValidThrough(e.target.value)}
          />
          <ValidationErrorList
            errors={errors?.ValidThrough}
          />
          <Button
            onClick={handleCreateInvite}
            disabled={!validThrough}
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            roomInvites[roomId] ? (
              Object.values(roomInvites[roomId]).map((invite) => (
              <tr key={invite.inviteString}>
                <td className="Creator">
                  <img
                    src={GetImageUrl(invite.creator.avatar)}
                  />
                  <p>{invite.creator.username}</p>
                </td>
                <td>
                  <div
                    className="Code"
                    onClick={() => handleClickInviteCode(invite.inviteString)}
                  >
                    {invite.inviteString}
                  </div>
                </td>
                <td>
                  {formatDay(invite.validThrough)}
                </td>
                <td>
                  <button
                    className="Delete"
                    onClick={() => {
                      setInviteToDelete(invite)
                      setShowConfirmDeleteModal(true)
                    }}
                  >
                    <MdDeleteOutline />
                  </button>
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
        {showConfirmDeleteModal && (
          <Modal onClose={() => setShowConfirmDeleteModal(false)}>
            <ConfirmationModal
              title="Are you sure you want to delete this invite?"
              subTitle="Once deleted, the invite code will no longer be valid."
              onConfirm={() => handleDeleteInvite(inviteToDelete)}
              onCancel={() => setShowConfirmDeleteModal(false)}
              yesText="Delete"
              noText="Cancel"
            />
          </Modal>
        )}
      </table>
    </div>
  )
}

export default ChatSettingsInvites;