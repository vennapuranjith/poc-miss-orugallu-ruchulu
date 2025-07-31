import React from "react";
import "./ToastMessage.css";

function ToastMessage({ message }) {
  return (
    <div className="toast">
      {message}
    </div>
  );
}

export default ToastMessage;