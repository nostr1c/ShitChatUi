import { useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import "./scss/FriendsList.scss"
import { GetImageUrl } from "../utils/general";
import Modal from "./Modal";
import SearchUserModal from "./SearchUserModal";
import { setConnections } from "../redux/connection/connectionSlice";
import { useDispatch, useSelector } from "react-redux";

function FriendsList() {
  const api = useApi();
  const dispatch = useDispatch();
  const [friendsList, setFriendsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchUserModal, setShowSearchUserModal] = useState(false);

  const { connections } = useSelector((state) => state.connection);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("user/connections");
        dispatch(setConnections(data.data));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // if (loading) {
  //   return <p>Loading friends...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error}</p>;
  // }

  return (
    <div className="Friends">
      <h3>Friends</h3>
      <button
        onClick={() => setShowSearchUserModal(true)}
      >Add friends</button>
      {showSearchUserModal && (
        <Modal onClose={() => setShowSearchUserModal(false)}>
          <SearchUserModal />
        </Modal>
      )}

      {
        connections.accepted && connections.accepted.length > 0 ? (
          connections.accepted.map((c) => (
            <p>{c.user.username}</p>
          ))
        ) : null
      }
    </div>
  );
}

export default FriendsList;
