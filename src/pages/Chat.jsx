import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useApi } from "../services/useApi";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setCurrentRoom, setRoomInfo } from "../redux/chat/chatSlice";
import ChatSidebar from "../components/ChatSidebar";
import "./scss/Chat.scss";
import { signalRService } from "../services/signalRService";
import { FaUserFriends } from "react-icons/fa";
import { IoIosSettings, IoMdChatboxes } from "react-icons/io";
import MessageItem from "../components/MessageItem";
import { useRoomData } from "../services/useRoomData";
import PermissionGate from "../components/PermissionGate";
import { use } from "react";

function Chat() {
  const api = useApi();
  const dispatch = useDispatch();
  const { id: roomId } = useParams();
  const messageRef = useRef();
  const typingTimeoutRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { messages, roomMembers, roomInfo } = useRoomData(roomId);
  
  const messagesEndRef = useRef(null);  

  useEffect(() => {
    if (roomId) 
      dispatch(setCurrentRoom(roomId));

    return () => {
      dispatch(setCurrentRoom(null));
    };
  }, [roomId, dispatch]);

  const fetchMoreMessages = async () => {
    try {
      const lastMessage = messages[roomId]?.[messages[roomId].length - 1];
      const { data } = await api.get(`group/${roomId}/messages?lastMessageId=${lastMessage.id}`);
      if (data.data.length < 40) setHasMore(false);
      dispatch(addMessage({ room: roomId, message: data.data }));  
      
    } catch (error) {
      setError(error.message);
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = async () => {
    const content = messageRef.current.value
    if (content.trim()) {
      await api.post(`/group/${roomId}/messages`, { content });
      messageRef.current.value = "";
      setTyping(false);
      sendTypingSignal(false);
    }
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
    signalRService.invoke("TypeIndicator", roomId, user?.id, isTyping);
  };

    useEffect(() => {
      if (!roomId || !messages[roomId]?.length) return;

      const lastMessage = messages[roomId][0];
      console.log(lastMessage);

      const markRoomAsRead = async () => {
        try {
          await api.post(`group/${roomId}/read`, { lastMessageId: lastMessage.id });
          dispatch(setRoomInfo({ 
            room: roomId,
            data: { ...roomInfo[roomId],
              lastReadMessageId: lastMessage.id 
            }
          }));
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };

      markRoomAsRead();

    }, [roomId, messages[roomId]]);

  return (
    <div className="Chat">
      <div className="Chat--Top">
        <PermissionGate
          roomId={roomId}
          userId={user.id}
          permissions={["manage_server", "manage_server_roles", "manage_invites"]}
        >
          <Link
            className="Chat--Top--Btn Settings"
            to={"settings"}
          >
            <IoIosSettings />
          </Link>
        </PermissionGate>
        <h1>
          {roomInfo[roomId] ? roomInfo[roomId].name : "Loading..."}
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
            {messages[roomId]?.length > 0 ? (
              messages[roomId].map((m) => (
                <MessageItem
                  key={m.id}
                  message={m}
                  currentUser={user}
                  member={roomMembers[roomId]?.[m.userId]}
                />
              ))
            ) : (
              <div className="Messages--Not-Found">
                <IoMdChatboxes />
                <h4>No messages.</h4>
                <p>Be the first one to be social.</p>
              </div>
            )}
            {messages[roomId] && messages[roomId].length >= 40 && hasMore ? (
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
            members={roomMembers[roomId]}
            room={roomInfo[roomId]}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;