import { useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import { useDispatch, useSelector } from "react-redux";
import { pushMesage, setRooms } from "../features/chat/chatSlice";
import { Link } from "react-router-dom";
import "./scss/GroupChats.scss"

function GroupChats() {
  const api = useApi();
  const [groupChats, setGroupChats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {messages} = useSelector((state) => state.chat)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchGroupChats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("user/groups");
        setGroupChats(data.data);
        dispatch(setRooms(data.data))
      } catch (error) {
        setError(error.message);
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupChats();
  }, []);

  return (
    <div className="GroupChats">
      <h3>Conversations</h3>
      {groupChats && groupChats.length > 0 ? (
        <div className="GroupChats--Parent">
          {groupChats.map((group) => (
            <Link
            to={`chat/${group.id}`}
            className="GroupChats--Child"
            key={group.id}
            >
              <div className="GroupChats--Child--Avatar">
                {group.name[0]}
              </div>
              <div className="GroupChats--Child--Content">
                <p>{group.name}</p>
                <p className="Latest">
                  {messages[group.id] && messages[group.id].length > 0 ? 
                    messages[group.id][0].content : 
                    group.latest ? group.latest :
                    "No messages"
                  }
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="Friends--None">No friends found.</p>
      )}
    </div>
  )
}

export default GroupChats;