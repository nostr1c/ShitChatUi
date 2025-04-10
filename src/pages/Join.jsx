import { useEffect } from "react";
import { useApi } from "../services/useApi";
import { useNavigate, useParams } from "react-router-dom";
import { signalRService } from "../services/signalRService";

function Join() {
  const api = useApi();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(params.id)

    const joinRoom = async () => {
      try {
        const { data } = await api.post(`invite/join/${params.id}`);

        await signalRService.invoke("JoinGroup", data.data.group);
        console.log(`Joined room: ${data.data.group}`);  

        navigate(`/chat/${data.data.group}`);
      } catch (error) {
        console.error(error.response.data.message)
      }
    }

    joinRoom();

  }, [params.id])

  return (
    <p>Joining...</p>
  )
}

export default Join;