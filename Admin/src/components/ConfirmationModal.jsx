// ConfirmationModal.js
import React from 'react';
import './ConfirmationModal.css'; // Optional: Add your modal styling here

const ConfirmationModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <p>Add Completed order to Sale?</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onClose}>No</button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
