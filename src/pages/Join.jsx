import { useEffect } from "react";
import { useApi } from "../services/useApi";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { signalRService } from "../services/signalRService";
import { useDispatch } from "react-redux";
import { showToast } from "../features/toast/toastThunks";

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
        await signalRService.waitUntilConnected();

        const { data } = await api.post(`invite/join/${params.id}`);

        await signalRService.invoke("JoinGroup", data.data.group);
        console.log(`Joined room: ${data.data.group}`);  

        navigate(`/chat/${data.data.group}`);
      } catch (error) {
        console.error(error);
        if (error.response.data.message) {
          dispatch(showToast("error", error.response.data.message));

          if (error.response.data.message == "ErrorAlreadyInGroup") {
            navigate(`/chat/${error.response.data.data.group}`);
            return;
          }

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