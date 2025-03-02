import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";

function ClothesSection({ onCardClick, clothingItems, weatherData, onAddNew }) {
  return (
    <div className="clothes__section">
      <div className="clothes__items">
        <p className="clothes__title">Your items</p>
        <button className="clothes__add-new" onClick={onAddNew}>
          + Add New
        </button>
      </div>
      <ul className="clothes-section__items">
        {clothingItems
          .filter((item) => item.weather === weatherData.type)
          .map((item) => (
            <ItemCard key={item._id} item={item} onCardClick={onCardClick} />
          ))}
      </ul>
    </div>
  );
}

export default ClothesSection;
