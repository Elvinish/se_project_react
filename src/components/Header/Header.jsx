import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.svg";

import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";

function Header({
  handleAddClick,
  weatherData,
  onLoginClick,
  onRegisterClick,
  isLoggedIn,
}) {
  const currentUser = useContext(CurrentUserContext);

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const userInitial = currentUser?.name?.charAt(0).toUpperCase();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/">
          {" "}
          <img className="header__logo" alt="logo" src={logo} />
        </Link>
        <p className="header__date-and-location">
          {currentDate}, {weatherData.city}
        </p>
      </div>
      <ToggleSwitch />

      {isLoggedIn ? (
        <>
          <button
            onClick={handleAddClick}
            type="button"
            className="header__add-clothes-btn"
          >
            + Add clothes
          </button>
          <Link to="/profile" className="header__link">
            <div className="header__user-container">
              <p className="header__username">{currentUser?.name || "User"}</p>
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="header__avatar"
                />
              ) : (
                <div className="header__avatar-placeholder">{userInitial}</div>
              )}
            </div>
          </Link>
        </>
      ) : (
        <div className="header__auth">
          <button className="header__auth-button" onClick={onRegisterClick}>
            Sign Up
          </button>
          <button className="header__auth-button" onClick={onLoginClick}>
            Log In
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
