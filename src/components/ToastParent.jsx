import React from "react";
import { useSelector } from "react-redux";
import "./scss/Toasts.scss";

function ToastParent() {
  const toasts = useSelector((state) => state.toast.toasts);

  return (
    <div id="Toasts">
      <div id="Toasts--Parent">
        {toasts.map((toast, index) => (
          <div className={`Toast ${toast.type}`} key={index}>
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToastParent;
