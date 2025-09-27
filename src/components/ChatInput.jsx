import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import "../pages/scss/Chat.scss";


export default function ChatInput({ onSend, onTyping, image, setImage, roomId }) {
  const messageRef = useRef();
  const typingTimeoutRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (image) setPreview(URL.createObjectURL(image));
    else setPreview(null);

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    }
  }, [image]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, [image, roomId]);

  const handleInputChange = () => {
    if (!typing) {
      setTyping(true);
      onTyping(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      onTyping(false);
    }, 2000);
  };

  const handleSend = async () => {
    const content = messageRef.current.value;
    if (!content && !image) return;

    const formData = new FormData();
    if (content.trim()) formData.append("Content", content);
    if (image) formData.append("Attachment", image);

    await onSend(formData);
    messageRef.current.value = "";
    setImage(null);
    setTyping(false);
    onTyping(false);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="Chat--Send">
      <div className="Send">
        {preview && (
          <div className="Image-Preview">
            <button
              className="Delete-Image"
              onClick={() => setImage(null)}
            >
              <RiDeleteBin6Fill/>
            </button>
            <img className="Img" src={preview} />
          </div>
        )}
        <input
          type="text"
          ref={messageRef}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}
