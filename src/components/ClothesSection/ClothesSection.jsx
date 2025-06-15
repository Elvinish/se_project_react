import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";

function ClothesSection({
  onCardClick,
  clothingItems,
  weatherData,
  onAddNew,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);
  const userItems = clothingItems.filter(
    (item) => item.owner === currentUser?._id
  );
  return (
    <div className="clothes__section">
      <div className="clothes__items">
        <p className="clothes__title">Your items</p>
        <button className="clothes__add-new" onClick={onAddNew}>
          + Add New
        </button>
      </div>
      <ul className="clothes-section__items">
        {userItems.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
          />
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
