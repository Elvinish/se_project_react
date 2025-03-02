import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";
import WeatherCard from "../WeatherCard/WeatherCard";

function Profile({ onCardClick, clothingItems, weatherData, onAddNew }) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar />
      </section>
      <section className="profile__clothing-items">
        <ClothesSection
          onCardClick={onCardClick}
          clothingItems={clothingItems}
          weatherData={weatherData}
          onAddNew={onAddNew}
        />
      </section>
    </div>
  );
}

export default Profile;
