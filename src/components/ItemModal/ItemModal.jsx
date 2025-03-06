import Modal from "../Modal/Modal";
import "./ItemModal.css";

function ItemModal({ isOpen, onClose, card, onDelete }) {
  if (!card) return null;

  const handleDeleteClick = () => {
    onClose();
    onDelete(card._id);
  };

  return (
    <Modal
      name="preview"
      isOpen={isOpen}
      onClose={onClose}
      closeButtonType="default"
    >
      <div className="modal__content modal__content_type_image">
        <img
          src={card.imageUrl || card.link}
          alt={`Image of ${card.name}`}
          className="modal__image"
        />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>
          <button onClick={handleDeleteClick} className="modal__delete-button">
            Delete item
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ItemModal;
