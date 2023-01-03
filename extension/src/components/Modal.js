import React from "react";

import "../styles/Modal.css";

const Modal = ({ open, onClose, children }) => {
  if (!open) {
    return <></>;
  }

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
