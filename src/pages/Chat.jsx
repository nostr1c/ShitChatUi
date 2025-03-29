import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useApi } from "../services/useApi";
import { useDispatch, useSelector } from "react-redux";
import { addMembersToRoom, addMessage, setRoomInfo } from "../features/chat/chatSlice";
import ChatSidebar from "../components/ChatSidebar";
import { GetImageUrl } from "../utils/general";
import "./scss/Chat.scss";

function Chat() {
  const api = useApi();
  const dispatch = useDispatch();
  const params = useParams();
  const messageRef = useRef();

  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { messages, roomMembers, roomInfo } = useSelector((state) => state.chat)

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`group/v2/${params.id}/messages`);

        dispatch(addMessage({ room: params.id, message: data.data }));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomMembers = async () => {
      try {
        const { data }  = await api.get(`group/${params.id}/members`);
        dispatch(addMembersToRoom({ room: params.id, members: data.data }));
      } catch (error) {
        console.error("Error fetching room members: ", error)
      }
    }

    const fetchRoomInfo = async () => {
      try {
        const { data }  = await api.get(`group/${params.id}`);

        dispatch(setRoomInfo({ room: params.id, data: data.data }));
      } catch (error) {
        console.error("Error fetching room data: ", error)
      }
    }

    if (params.id && !messages[params.id]) {
      fetchMessages();
    }

    if (params.id && !roomMembers[params.id]) {
      fetchRoomMembers();
    }

    if (params.id && !roomInfo[params.id]) {
      fetchRoomInfo();
    }

  }, [params.id]);

  const fetchMoreMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`group/v2/${params.id}/messages?lastMessageId=${messages[params.id]?.[messages[params.id].length - 1]?.id}`);
      
      if (data.data.length < 20) {
        setHasMore(false);
      }

      dispatch(addMessage({ room: params.id, message: data.data }));  
      
    } catch (error) {
      setError(error.message);
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const content = messageRef.current.value
    if (content.trim()) {
      await api.post(`/group/${params.id}/messages`, { content });
      messageRef.current.value = "";
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric"
    }).format(date);
  };

  return (
    <div className="Chat">
      <div className="Chat--Top">
        <h1>{roomInfo[params.id] ? roomInfo[params.id].name : "Loading..."}</h1>
      </div>
      <div className="Chat--Content">
        <div className="Chat--Content--Main">
          <div className="Chat--Messages">
            {messages[params.id] && messages[params.id].length > 0 ? (
              messages[params.id].map((message) => ( 
                <div 
                className={`Message ${user.data.id == message.user.id ? "Self" : null}`}
                key={message.id}
                >
                <img className="Message--Avatar" src={GetImageUrl(message.user.avatar)}/>
                <div className="Message--Content">
                  <div className="Message--Content--Top">
                    {user.data.id != message.user.id ? (
                      <p className="Message--Content--Top--Name">{message.user.username}</p>
                    ) : null}
                    <p className="Message--Content--Top--Date">{formatDate(message.createdAt)}</p>
                  </div>
                  <div className="Message--Content--Text">
                    {message.content}
                  </div>
                </div>
              </div>
              ))
            ) : (
              <p style={{ color: "white" }}>No messages found</p>
            )}
            {messages[params.id] && messages[params.id].length >= 20 && hasMore ? (
              <button onClick={() => {fetchMoreMessages()}}>Ladda mer</button>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
          <div className="Chat--Send">
            <div className="Send">
              <input
                type="text"
                ref={messageRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }} 
                placeholder="Type a message..." 
              />
            </div>
          </div>
        </div>
        <div className="Chat--Content--Sidebar">
          <ChatSidebar
            members={roomMembers[params.id]}
            room={roomInfo[params.id]}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;