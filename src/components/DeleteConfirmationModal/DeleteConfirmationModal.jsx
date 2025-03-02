import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <div className={`delete-modal ${isOpen ? "delete-modal_opened" : ""}`}>
      <div className="delete-modal__content">
        <button
          onClick={onClose}
          type="button"
          className="delete-modal__close"
        />
        <div className="delete-modal__header">
          <p className="delete__text">
            Are you sure you want to delete this item?
          </p>
          <p className="delete__text">This action is irreversible.</p>
        </div>
        <div className="delete-modal__buttons">
          <button onClick={onConfirm} className="modal__confirm-delete">
            Yes, delete item
          </button>
          <button onClick={onClose} className="modal__cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmationModal;
