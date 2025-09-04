import { useEffect, useState } from "react";
import { useApi } from "../services/useApi";
import { useDispatch, useSelector } from "react-redux";
import { setRooms } from "../redux/chat/chatSlice";
import { Link } from "react-router-dom";
import { BiMessageSquareAdd } from "react-icons/bi";
import "./scss/GroupChats.scss"

function GroupChats() {
  const api = useApi();
  const [groupChats, setGroupChats] = useState(null);
  const {messages, rooms} = useSelector((state) => state.chat)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchGroupChats = async () => {
      try {
        const { data } = await api.get("user/groups");
        setGroupChats(data.data);
        dispatch(setRooms(data.data))
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroupChats();
  }, []);

  return (
    <div className="GroupChats">
      <div className="GroupChats--Header">
        <h3>Conversations</h3>
        <Link
          className="GroupChats--Header--Link"
          to={"/chat/create"}
        >
          <BiMessageSquareAdd/>
        </Link>
      </div>
      {rooms && rooms.length > 0 ? (
        <div className="GroupChats--Parent">
          {rooms.map((group) => (
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