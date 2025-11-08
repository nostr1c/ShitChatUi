import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./scss/Friends.scss";
import SearchUserModal from "../components/SearchUserModal";
import FriendSection from "../components/Friends/FriendSection";
import Modal from "../components/Modal";
import { useConnectionActions } from "../redux/connection/connectionThunk";

function Friends() {
  const [showSearchUserModal, setShowSearchUserModal] = useState(false);
  const { connections } = useSelector((state) => state.connection);
  const { fetchFriends, handleAcceptRequest, handleDeleteRequest } = useConnectionActions();

  const sentRequests = connections?.sentRequests;
  const receivedRequests = connections?.receivedRequests;
  const acceptedFriends = connections?.accepted;

  useEffect(() => {
    if (!connections) fetchFriends();
  }, []);

  return (
    <div className="Friends">
      <div className="Friends--Content">
        <button
          className="SearchBtn"
          onClick={() => setShowSearchUserModal(true)}
        >
          Search users
        </button>
        {showSearchUserModal && (
          <Modal onClose={() => setShowSearchUserModal(false)}>
            <SearchUserModal 
              onClose={() => setShowSearchUserModal(false)}
            />
          </Modal>
        )}
          <FriendSection
            title="Sent friend requests"
            data={sentRequests}
            emptyText="No sent requests."
            renderActions={(user) => [
              {
                label: "Revoke",
                variant: "Revoke",
                onClick: () => handleDeleteRequest(user.id),
              },
            ]}
          />
          <FriendSection
            title="Received friend requests"
            data={receivedRequests}
            emptyText="No incoming requests."
            renderActions={(user) => [
              {
                label: "Accept",
                variant: "Accept",
                onClick: () => handleAcceptRequest(user.id),
              },
              {
                label: "Deny",
                variant: "Deny",
                onClick: () => handleDeleteRequest(user.id),
              },
            ]}
          />

          <FriendSection
            title="Friends"
            data={acceptedFriends}
            emptyText="No friends yet."
            renderActions={(user) => [
              {
                label: "Delete friend",
                variant: "Deny",
                onClick: () => handleDeleteRequest(user.id),
              },
            ]}
          />
      </div>
    </div>
  );
}

export default Friends;