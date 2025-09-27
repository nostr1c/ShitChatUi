import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../services/useApi";
import { addMessage, setCurrentRoom, setRoom } from "../redux/chat/chatSlice";
import { signalRService } from "../services/signalRService";
import ChatTopBar from "../components/ChatTopBar";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ChatSidebar from "../components/ChatSidebar";
import DropZone from "../components/DropZone";
import { useRoomData } from "../services/useRoomData";
import "./scss/Chat.scss";
import { toast } from "react-toastify";
import ChatImagePreview from "../components/ChatImagePreview";

export default function Chat() {
  const { id: roomId } = useParams();
  const dispatch = useDispatch();
  const api = useApi();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { rooms } = useSelector((state) => state.chat);
  const { messages, roomMembers } = useRoomData(roomId);

  const [hasMore, setHasMore] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  }

  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsDraggingFile(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    if (files.length > 1) {
      toast.error("Only one image can be sent at a time");
      return;
    }

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setImage(file);
  };

  useEffect(() => {
    if (roomId) 
      setHasMore(true);
      dispatch(setCurrentRoom(roomId));

    return () => {
      dispatch(setCurrentRoom(null));
    };
  }, [roomId]);

  useEffect(() => {
    if (Object.keys(rooms).length > 0 && !rooms[roomId]) navigate("/");
  }, [rooms, roomId, navigate]);

  const fetchMoreMessages = async () => {
    try {
      const lastMessage = messages[roomId]?.[messages[roomId].length - 1];
      const { data } = await api.get(`group/${roomId}/messages?lastMessageId=${lastMessage.id}`);
      if (data.data.length < 40) setHasMore(false);
      dispatch(addMessage({ room: roomId, message: data.data }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = async (formData) => {
    try {
      await api.post(`/group/${roomId}/messages`, formData);
    } catch (error) {
      console.error("Error sending message:", error.response.data);
    }
  };

  const handleTyping = (isTyping) => {
    signalRService.invoke("TypeIndicator", roomId, user?.id, isTyping);
  };

  const handlePreviewImage = (img) => {
    setPreviewImage(img);
    setShowImagePreview(true);
  }

  // Mark messages as read
  useEffect(() => {
    if (!roomId || !messages[roomId]?.length) return;
    const lastMessage = messages[roomId][0];
    const markRoomAsRead = async () => {
      try {
        await api.post(`group/${roomId}/read`, { lastMessageId: lastMessage.id });
        dispatch(
          setRoom({
            room: roomId,
            data: { ...rooms[roomId], lastReadMessageId: lastMessage.id }
          })
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };
    markRoomAsRead();
  }, [roomId, messages[roomId]]);

  return (
    <div className="Chat">
      <ChatTopBar room={rooms[roomId]} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} userId={user.id} />
      <div id="Chat-Content" className="Chat--Content">
        <div className="Chat--Content--Main">
          {showImagePreview && (
            <ChatImagePreview 
              image={previewImage}
              closeModal={() => setShowImagePreview(false)}
            />
          )}
          <div
            className="Chat-Messages-Wrapper"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDraggingFile && <DropZone />}
            <ChatMessages
              messages={messages[roomId]}
              currentUser={user}
              roomMembers={roomMembers[roomId]}
              onLoadMore={fetchMoreMessages}
              hasMore={hasMore}
              previewImage={handlePreviewImage}
            />
          </div>
          <ChatInput
            onSend={handleSend}
            onTyping={handleTyping}
            image={image}
            setImage={setImage}
            roomId={roomId}
          />
        </div>
        <div className={`Chat--Content--Sidebar ${sidebarOpen ? "Open" : ""}`}>
          <ChatSidebar members={roomMembers[roomId]} room={rooms[roomId]} />
        </div>
      </div>
    </div>
  );
}