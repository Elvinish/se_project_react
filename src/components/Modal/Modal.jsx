import { useEffect } from "react";
import "./Modal.css";

const Modal = ({
  name,
  isOpen,
  onClose,
  closeButtonType = "default",
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null; // Prevent rendering when modal is closed

  return (
    <div
      className={`modal modal_type_${name} ${isOpen ? "modal_opened" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="modal__container">
        <button
          className={`modal__close modal__close_type_${closeButtonType}`}
          type="button"
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
