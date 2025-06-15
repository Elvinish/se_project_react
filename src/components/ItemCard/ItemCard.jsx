import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import "./ItemCard.css";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  const isLoggedIn = !!currentUser?._id;
  const isLiked = item.likes?.some((id) => id === currentUser?._id);

  const itemLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_liked" : ""
  }`;

  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLike = () => {
    onCardLike({ id: item._id, likes: item.likes });
  };

  return (
    <li className="card">
      <div className="card__header">
        <h2 className="card__name">
          <span className="card__name-text">{item.name}</span>
        </h2>
        {isLoggedIn && (
          <button
            onClick={handleLike}
            className={itemLikeButtonClassName}
            aria-label="Like button"
          >
            <span className="card__like-icon"></span>
          </button>
        )}
      </div>
      <img
        onClick={handleCardClick}
        className="card__image"
        src={item.imageUrl || item.link || "/images/placeholder.png"}
        alt={item.name}
      />
    </li>
  );
}

export default ItemCard;
