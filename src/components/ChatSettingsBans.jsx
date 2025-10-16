import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useApi } from "../services/useApi";
import { setRoomBans } from "../redux/chat/chatSlice";
import BanChild from "./BanChild";
import "./scss/ChatSettingsBans.scss";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";
import BanInfo from "./BanInfo";
import { toast } from "react-toastify";

function ChatSettingsBans() {
  const { id: roomId} = useParams();
  const dispatch = useDispatch();
  const api = useApi();
  const bans = useSelector((state) => state.chat.roomBans[roomId]);
  const bansArray = bans ? Object.values(bans) : [];
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedBan, setSelectedBan] = useState(null);

  const fetchRoomBans = async () => {
    try {
      const result = await api.get(`group/${roomId}/bans`);
      dispatch(setRoomBans({ roomId: roomId, bans: result.data.data }));
    } catch (error) {
      console.error("Error fetching room bans: ", error)
    }
  }

  const handleDeleteBan = async () => {
    setShowBanModal(false);
    try {
      const result = await api.delete(`group/${roomId}/bans/${selectedBan.id}`);
      setSelectedBan(null);
      if (result.data.message) {
        toast.success(result.data.message)
      }
      console.log(result)

    } catch(error) {
        const response = error.response.data;
        console.error("Error deleting ban:", response.data);
        if (response.hasErrors) {
          setErrors(response.errors);
          toast.error(response.message || "Error deleting invite");
        }
    }
  }

  // Only fetch if not already
  if (roomId && !bans) fetchRoomBans();

  return (
    <div className="Bans">
      {showBanModal && (
        <Modal onClose={() => setShowBanModal(false)}>
          <ConfirmationModal
            title={`Unban ${selectedBan.userDto.username}?`} 
            subTitle="User will be able to join the server with invite link."
            yesText="Unban"
            noText="Cancel"
            onConfirm={handleDeleteBan}
            onCancel={() => setShowBanModal(false)}
          >
            <BanInfo 
              ban={selectedBan}
            />
          </ConfirmationModal>
        </Modal>
      )}
      {bansArray && bansArray.length > 0 ? (
        bansArray.map((ban) => {
          return (
            <BanChild
              key={ban.id}
              ban={ban}
              onClick={() => {
                setSelectedBan(ban);
                setShowBanModal(true);
              }}
            />
          )
        })
      ) : <p>No bans found</p>}
    </div>

  )
}

export default ChatSettingsBans;