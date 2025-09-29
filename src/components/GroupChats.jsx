import { useEffect } from "react";
import { useApi } from "../services/useApi";
import {  useDispatch, useSelector } from "react-redux";
import { setRooms } from "../redux/chat/chatSlice";
import { Link } from "react-router-dom";
import { RiChatNewFill } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";


import "./scss/GroupChats.scss"

function GroupChats() {
  const api = useApi();
  const { messages, rooms, currentRoom } = useSelector((state) => state.chat)
   const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroupChats = async () => {
      try {
        const { data } = await api.get("user/groups");
        dispatch(setRooms(data.data))
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroupChats();
  }, []);

  const roomsArray = rooms ? Object.values(rooms) : [];

  return (
    <div className="GroupChats">
      <div className="GroupChats--Header">
        <div></div>
        <div>
          <h3>Conversations</h3>
        </div>
        <div>
        <Link
          className="GroupChats--Header--Link"
          to={"/chat/create"}
        >
          <IoMdAddCircleOutline/>
        </Link>
        </div>
      </div>
      {roomsArray.length > 0 ? (
        <div className="GroupChats--Parent">
          {roomsArray.map((group) => {
            const unreadCount = group.unreadCount || 0;

            return (
              <Link
              to={`chat/${group.id}`}
              className={`GroupChats--Child ${currentRoom == group?.id ? "Active" : ""}`}
              key={group.id}
              >
                <div className="GroupChats--Child--Avatar">
                  {group?.name[0]}
                </div>
                <div className="GroupChats--Child--Content">
                  <p>{group.name}</p>
                  <p className={`Latest ${unreadCount > 0 ? "Unread" : ""}`}>
                    {messages[group.id] && messages[group.id].length > 0 ? 
                      messages[group.id][0].content : 
                      group.latestMessage ? `${group.latestMessage}` :
                      "No messages"
                    }
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="GroupChats--Child--Unread">
                    <p>{unreadCount}</p>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="Friends--None">No friends found.</p>
      )}
    </div>
  )
}

export default GroupChats;