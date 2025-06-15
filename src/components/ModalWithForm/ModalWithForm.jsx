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
  footer,
}) {
  return (
    <Modal name={name} isOpen={isOpen} onClose={onClose} closeButtonType="grey">
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>

        <form onSubmit={onSubmit} className="modal__form">
          {children}
          <div className="modal__form-footer">
            <button
              type="submit"
              className={`modal__submit modal__submit_type_${name}`}
            >
              {buttonText}
            </button>
            {footer}
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModalWithForm;
