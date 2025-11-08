import { useEffect } from "react";
import { useApi } from "../services/useApi";
import {  useDispatch, useSelector } from "react-redux";
import { setRooms } from "../redux/chat/chatSlice";
import { NavLink } from "react-router-dom";
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
      {roomsArray.length > 0 ? (
        <div className="GroupChats--Parent">
          {roomsArray.map((group) => {
            const unreadCount = group.unreadCount || 0;
            const hasUnread = unreadCount > 0;

            return (
              <NavLink
              to={`chat/${group.id}`}
              className="GroupChats--Child"
              key={group.id}
              >
                <div className="GroupChats--Child--Avatar">
                  {group?.name[0]}
                </div>
                <div className="GroupChats--Child--Content">
                  <p>{group.name}</p>
                  <p className={`Latest ${hasUnread ? "Unread" : ""}`}>
                    {messages[group.id] && messages[group.id].length > 0 ? 
                      messages[group.id][0].content : 
                      group.latestMessage ? `${group.latestMessage}` :
                      "No messages"
                    }
                  </p>
                </div>
                {hasUnread && (
                  <div className="GroupChats--Child--Unread">
                    <p>{unreadCount}</p>
                  </div>
                )}
              </NavLink>
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