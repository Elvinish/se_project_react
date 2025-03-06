import Modal from "../Modal/Modal";
import "./ModalWithForm.css";

function ModalWithForm({
  name,
  isOpen,
  onClose,
  title,
  buttonText,
  onSubmit,
  children,
}) {
  return (
    <Modal name={name} isOpen={isOpen} onClose={onClose} closeButtonType="grey">
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>

        <form onSubmit={onSubmit} className="modal__form">
          {children}
          <button type="submit" className="modal__submit">
            {buttonText}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ModalWithForm;
