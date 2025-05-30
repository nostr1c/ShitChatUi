import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useApi } from "../services/useApi";
import { useDispatch, useSelector } from "react-redux";
import { addMembersToRoom, addMessage, setRoomInfo } from "../features/chat/chatSlice";
import ChatSidebar from "../components/ChatSidebar";
import { GetImageUrl } from "../utils/general";
import "./scss/Chat.scss";
import { signalRService } from "../services/signalRService";
import { FaUserFriends } from "react-icons/fa";
import { IoIosSettings, IoMdChatboxes } from "react-icons/io";


function Chat() {
  const api = useApi();
  const dispatch = useDispatch();
  const params = useParams();
  const messageRef = useRef();
  const messagesEndRef = useRef(null);  
  const typingTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { 
    messages,
    roomMembers,
    roomInfo
  } = useSelector((state) => state.chat)


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`group/${params.id}/messages`);

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


    if (params.id && !messages[params.id]) fetchMessages();
    if (params.id && !roomMembers[params.id]) fetchRoomMembers();
    if (params.id && !roomInfo[params.id]) fetchRoomInfo();
  }, [params.id]);

  const fetchMoreMessages = async () => {
    try {
      const lastMessage = messages[params.id]?.[messages[params.id].length - 1];
      const { data } = await api.get(`group/${params.id}/messages?lastMessageId=${lastMessage.id}`);
      if (data.data.length < 40) setHasMore(false);
      dispatch(addMessage({ room: params.id, message: data.data }));  
      
    } catch (error) {
      setError(error.message);
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = async () => {
    const content = messageRef.current.value
    if (content.trim()) {
      await api.post(`/group/${params.id}/messages`, { content });
      messageRef.current.value = "";
      setTyping(false);
      sendTypingSignal(false);
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

  const handleInputChange = () => {
    if (!typing) {
      setTyping(true);
      sendTypingSignal(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      sendTypingSignal(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const sendTypingSignal = (isTyping) => {
    signalRService.invoke("TypeIndicator", params?.id, user?.id, isTyping);
  };

  return (
    <div className="Chat">
      <div className="Chat--Top">
        <Link
          className="Chat--Top--Btn Settings"
          to={"settings"}
        >
          <IoIosSettings />
        </Link>
        <h1>
          {roomInfo[params.id] ? roomInfo[params.id].name : "Loading..."}
        </h1>
        <button
          className="Chat--Top--Btn Sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaUserFriends />
        </button>
      </div>
      <div className="Chat--Content" id="Chat-Content">
        <div className="Chat--Content--Main">
          <div className="Chat--Messages">
            {messages[params.id] && messages[params.id].length > 0 ? (
              messages[params.id].map((message) => ( 
                <div 
                className={`Message ${user.id == message.userId ? "Self" : null}`}
                key={message.id}
                >
                <img className="Message--Avatar" src={GetImageUrl(roomMembers[params.id]?.[message.userId]?.user?.avatar)}/>
                <div className="Message--Content">
                  <div className="Message--Content--Top">
                    {user.id != message?.user?.id ? (
                      <p className="Message--Content--Top--Name">{message?.user?.username}</p>
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
              <div className="Messages--Not-Found">
                <IoMdChatboxes />
                <h4>No messages.</h4>
                <p>Be the first one to be social.</p>
              </div>
            )}
            {messages[params.id] && messages[params.id].length >= 40 && hasMore ? (
              <button className="Load-More" onClick={() => {fetchMoreMessages()}}>Ladda mer</button>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
          <div className="Chat--Send">
            <div className="Send">
              <input
                type="text"
                ref={messageRef}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }} 
                placeholder="Type a message..." 
              />
              <button
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <div className={`Chat--Content--Sidebar ${sidebarOpen ? "Open" : null}`}>
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