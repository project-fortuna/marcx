import React from "react";

import "../../styles/Modal.css";

const Modal = ({ open, onClose, droppableBackgroundRef, children }) => {
  if (!open) {
    return <></>;
  }

  return (
    <div ref={droppableBackgroundRef} className="modal-background" onClick={onClose}>
      <div
        className="modal-container"
        onMouseEnter={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
