import { useDispatch, useSelector } from "react-redux";
import "./scss/TopBar.scss"
import { GetImageUrl } from "../utils/general";
import { useApi } from "../services/useApi";
import { toast } from "react-toastify";

function TopBar() {
  const api = useApi();
  const dispatch = useDispatch();
  const { connections } = useSelector((state) => state.connection);

  const handleAcceptRequest = async (userId) => {
    try {
      const response = await api.put(`connection/accept?friendId=${userId}`);
      console.log(response.data.data)
      toast.success(response.data.message);
    } catch (e) {
      console.error(e.response.data.message);
    }
  }

  const handleDeleteRequest = async (userId) => {
    try {
      const response = await api.delete(`connection/delete?friendId=${userId}`);
      console.log(response)
      toast.success(response.data.message);
    } catch (e) {
      console.error(e.response.data.message);
    }
  }

  return (
    <div className="TopBar">
      <div className="TopBar--Content">
        <div className="Connections">
          <h4>Received friend requests</h4>
          {connections.receivedRequests && connections.receivedRequests.length > 0 ? (
            connections.receivedRequests.map((c) => (
              <div className="Connections--Child">
                <img src={GetImageUrl(c.user.avatar)} />
                <div className="Connections--Child--Content">
                  <p>{c.user.username}</p>
                  <div className="Connections--Child--Content--Actions">
                    <button
                      onClick={() => handleAcceptRequest(c.user.id)}
                    >Accept</button>
                    <button
                      onClick={() => handleDeleteRequest(c.user.id)}
                    >Deny</button>
                  </div>
                </div>
              </div>
            ))
          ) : (<p>No requests found</p>)}
        </div>

        <div className="Connections">
          <h4>Sent friend requests</h4>
          {connections.sentRequests && connections.sentRequests.length > 0 ? (
            connections.sentRequests.map((c) => (
              <div className="Connections--Child">
                <img src={GetImageUrl(c.user.avatar)} />
                <div className="Connections--Child--Content">
                  <p>{c.user.username}</p>
                  <div className="Connections--Child--Content--Actions Revoke">
                    <button
                      onClick={() => handleDeleteRequest(c.user.id)}
                    >Revoke</button>
                  </div>
                </div>
              </div>
            ))
          ) : (<p>No requests found</p>)}
        </div>
      </div>
    </div>
  )
}

export default TopBar;