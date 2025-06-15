import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

function Profile({
  onCardClick,
  clothingItems,
  weatherData,
  onAddNew,
  onEditProfileClick,
  onCardLike,
  onSignOut,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar name={currentUser?.name} avatar={currentUser?.avatar} />
        <div className="profile__buttons">
          <button onClick={onEditProfileClick} className="profile__edit-button">
            Change profile data
          </button>
          <button onClick={onSignOut} className="profile__signout-button">
            Sign Out
          </button>
        </div>
      </section>
      <section className="profile__clothing-items">
        <ClothesSection
          onCardClick={onCardClick}
          clothingItems={clothingItems}
          weatherData={weatherData}
          onAddNew={onAddNew}
          onCardLike={onCardLike}
        />
      </section>
    </div>
  );
}

export default Profile;
