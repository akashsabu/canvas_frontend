import React from "react";
import './Popup.css';

const Popup = ({ isOpen, onClose, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Overwrite Existing File?</h3>
        <p>Do you want to overwrite the existing file or create a new one?</p>
        <div className="popup-actions">
          <button onClick={onConfirm}>Overwrite</button>
          <button onClick={onCancel}>Create New</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
