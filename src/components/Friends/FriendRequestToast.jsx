import "./Scss/FriendRequestToast.scss"
import { GetImageUrl } from "../../utils/general"
import { useConnectionActions } from "../../redux/connection/connectionThunk";


function FriendRequestToast({ user, closeToast }) {
  const { handleAcceptRequest, handleDeleteRequest } = useConnectionActions();

  return (
    <div className="FriendToast">
      <img src={GetImageUrl(user.avatar)}/>
      <div className="FriendToast--Info">
        <h4>Friend request</h4>
        <p><span>{user.username}</span> wants to be your friend.</p>
        <div className="FriendToast--Info--Btns">
          <button
            onClick={() => {
              handleAcceptRequest(user.id);
              closeToast();
            }}
          >Accept</button>
          <button
            onClick={() => {
              handleDeleteRequest(user.id);
              closeToast();
            }}
          >Deny</button>
        </div>
      </div>
    </div>
  )
}

export default FriendRequestToast;