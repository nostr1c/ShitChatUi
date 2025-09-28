import { useEffect } from "react";
import { useApi } from "../services/useApi";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { signalRService } from "../services/signalRService";
import { useDispatch } from "react-redux";
import { pushRoom } from "../redux/chat/chatSlice";
import { toast } from "react-toastify";

function Join() {
  const api = useApi();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!params.id || params.id.length !== 8) {
    // TODO: navigate to 404
    return;
  }

  useEffect(() => {
    const joinRoom = async () => {
      try {
        await signalRService.startConnection([]);
        await signalRService.waitUntilConnected();

        const response = await api.post(`invite/join/${params.id}`);
        dispatch(pushRoom(response.data.data.group));

        await signalRService.invoke("JoinGroup", response.data.data.group.id);
        console.log(`(Invite) Joined room: ${response.data.data.group.id}`);  

        navigate(`/chat/${response.data.data.group.id}`);
      } catch (error) {
        console.error(error);
        var message = error.response.data.message;
        if (message) {
          toast.error(message)

          // if (message == "ErrorAlreadyInGroup") {
          //   navigate(`/chat/${error.response.data.data.group}`);
          //   return;
          // }

          navigate("/");
        }
      }
    }

    joinRoom();
  }, [params.id])

  return (
    <p>Joining...</p>
  )
}

export default Join;