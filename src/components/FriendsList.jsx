import { useEffect, useRef, useState } from "react";
import { useApi } from "../services/useApi";
import "./scss/FriendsList.scss"
import { GetImageUrl } from "../utils/general";

function FriendsList() {
  const api = useApi();
  const [friendsList, setFriendsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("user/connections");
        setFriendsList(data.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const showUser = (e, friend) => {
    e.preventDefault();
    setSelectedFriend(friend);
    setShowModal(true);

    const buttonRect = e.currentTarget.getBoundingClientRect();

    // For responsiveness
    if (window.innerWidth >= 780) {
      setModalPosition({
        top: (buttonRect.y - buttonRect.height) + window.scrollY - 25,
        left: buttonRect.width + 15
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFriend(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  if (loading) {
    return <p>Loading friends...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="Friends">
      <h3>Friends</h3>
      {friendsList && friendsList.length > 0 ? (
        <div className="Friends--List">
          {friendsList.map((friend) => (
            <button
              key={friend.id}
              className="Friends--List--Item"
              onClick={(e) => showUser(e, friend)}
            >
              <img
                src={GetImageUrl(friend.user.avatar)}
              />
              <p>{friend.user.username}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="Friends--None">No friends found.</p>
      )}
      {showModal && (
        <div
          ref={modalRef}
          className="Friends--Modal"
          style={{top: modalPosition.top, left: modalPosition.left}}
        >
          {selectedFriend ? (
            <div>
              <img src={GetImageUrl(selectedFriend.user.avatar)} />
              <h4>{selectedFriend.user.username}</h4>
              <p>{selectedFriend.user.email}</p>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      )}

    </div>
  );
}

export default FriendsList;
