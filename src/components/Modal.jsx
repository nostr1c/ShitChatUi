import "./scss/Modal.scss";
import { createPortal } from "react-dom";

function Modal({ onClose, children, }) {
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) return null;

  return createPortal(
    <div className="Modal">
      <div className="Modal--Overlay" onClick={onClose} />
      <div className="Modal--Content">
        {children}
      </div>
    </div>,
    modalRoot
  );
}

export default Modal;