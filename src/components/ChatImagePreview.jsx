import { GetImageUrl } from "../utils/general";
import "./scss/ChatImagePreview.scss"

function ChatImagePreview({ image, closeModal }) {
  if (!image) return null;

  return (
    <div className="PreviewImage">
      <img 
        src={GetImageUrl(image)}
        className="Image"
        draggable={false}
      />
      <div
        className="Overlay"
        onClick={closeModal}
      />
    </div>
  )
}

export default ChatImagePreview;