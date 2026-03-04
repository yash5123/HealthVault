import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default", // default | danger
}) {

  /* ================= ESC KEY CLOSE ================= */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
        </div>

        <div className="modal-body">
          {children}
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            className={`btn ${
              variant === "danger"
                ? "btn-danger"
                : "btn-primary"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}