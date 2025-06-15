import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import Footer from "../Footer/Footer";
import CurrentTemperatureUnitContext from "../../utils/contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

import {
  getItems,
  postItem,
  deleteItem,
  signup,
  signin,
  checkToken,
  updateUserProfile,
  removeCardLike,
  addCardLike,
} from "../../utils/api";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
  });

  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [isWeatherDataLoading, setIsWeatherDataLoading] = useState(true);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isAppLoading, setIsAppLoading] = useState(true);

  const handleRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const handleEditProfileClick = () => {
    setIsEditProfileModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeActiveModal = () => {
    setActiveModal(""); // ✅ Ensure all modals are closed
    setisDeleteModalOpen(false); // ✅ Close delete confirmation modal too
    setItemToDelete(null); // ✅ Reset itemToDelete state
  };

  const handleConfirmDelete = () => {
    console.log("Confirm delete clicked! itemToDelete:", itemToDelete);
    if (!itemToDelete) return; // Exit if there's no item to delete

    deleteItem(itemToDelete, localStorage.getItem("jwt"))
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemToDelete)
        );
        closeActiveModal();
      })
      .catch((err) => console.error("Error deleting item:", err));
  };

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    if (!clothingItems) {
      console.error("Clothing items not loaded yet.");
      return;
    }

    setIsLoading(true);

    postItem({ name, imageUrl, weather }, localStorage.getItem("jwt")) // Send to backend
      .then((newItem) => {
        setClothingItems((prevItems) =>
          prevItems ? [newItem.data, ...prevItems] : [newItem]
        );
        closeActiveModal();
      })
      .catch((err) => console.error("Error adding item:", err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegisterSubmit = (values) => {
    setIsLoading(true);
    signup(values)
      .then(() => {
        return signin({ email: values.email, password: values.password }); // ⬅️ auto login
      })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        setCurrentUser(res.data); // or whatever your backend returns
        closeRegisterModal();
      })
      .catch((err) => console.error("Registration/Login error:", err))
      .finally(() => setIsLoading(false));
  };

  const handleLoginSubmit = (values) => {
    setIsLoading(true);
    setLoginError(""); // clear previous errors

    signin(values)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        return checkToken(res.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        closeLoginModal();
      })
      .catch((err) => {
        if (err === "Error: 401") {
          setLoginError("Incorrect password");
        } else {
          setLoginError("Something went wrong. Please try again.");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleProfileUpdate = ({ name, avatar }) => {
    setIsLoading(true);
    updateUserProfile({ name, avatar }, localStorage.getItem("jwt"))
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditProfileModalOpen(false);
      })
      .catch((err) => console.error("Profile update failed:", err))
      .finally(() => setIsLoading(false));
  };

  const handleCardLike = ({ id, likes = [] }) => {
    const token = localStorage.getItem("jwt");

    const isLiked = likes.some((likeId) => likeId === currentUser?._id);

    if (!token || !id) return;

    const action = isLiked ? removeCardLike : addCardLike;

    action(id, token)
      .then((updatedCard) => {
        setClothingItems((prevItems) =>
          prevItems.map((item) => (item._id === id ? updatedCard.data : item))
        );
      })
      .catch((err) => console.log("❌ Like toggle failed:", err));
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    setIsWeatherDataLoading(true);
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error)
      .finally(() => {
        setIsWeatherDataLoading(false);
      });
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        console.log("Fetched clothing items:", data);
        //set the clothing items
        setClothingItems(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((userData) => {
          setIsLoggedIn(true);
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.error("Invalid token:", err);
          setIsLoggedIn(false);
          setCurrentUser(null);
        })
        .finally(() => {
          setIsAppLoading(false);
        });
    } else {
      setIsAppLoading(false);
    }
  }, []);

  return isAppLoading ? (
    <p>Loading...</p>
  ) : (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              onLoginClick={handleLoginModal}
              onRegisterClick={handleRegisterModal}
              isLoggedIn={isLoggedIn}
            />
            <Routes>
              <Route
                path="/"
                element={
                  isWeatherDataLoading ? ( // Conditional rendering based on loading state
                    <p>Loading weather data...</p> // Show loading message
                  ) : (
                    <Main
                      weatherData={weatherData}
                      onCardClick={handleCardClick}
                      clothingItems={clothingItems}
                      onCardLike={handleCardLike}
                    />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  isLoggedIn ? (
                    <Profile
                      key={currentUser?._id}
                      onCardClick={handleCardClick}
                      clothingItems={clothingItems}
                      weatherData={weatherData}
                      onAddNew={handleAddClick}
                      onEditProfileClick={handleEditProfileClick}
                      onCardLike={handleCardLike}
                      onSignOut={handleSignOut}
                    />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </div>
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onClose={closeActiveModal}
            onAddItemModalSubmit={handleAddItemModalSubmit}
            isLoading={isLoading}
          />

          <ItemModal
            isOpen={activeModal === "preview"}
            card={selectedCard}
            onClose={closeActiveModal}
            onDelete={() => {
              setItemToDelete(selectedCard._id); // ✅ Set the item to delete
              setisDeleteModalOpen(true); // ✅ Open delete confirmation modal
            }}
          />
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={closeActiveModal}
            onConfirm={handleConfirmDelete}
          />

          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={closeRegisterModal}
            onRegisterSubmit={handleRegisterSubmit}
            isLoading={isLoading}
            onSwitchToLogin={switchToLogin}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
            onLoginSubmit={handleLoginSubmit}
            isLoading={isLoading}
            loginError={loginError}
            onSwitchToRegister={switchToRegister}
          />

          <EditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setIsEditProfileModalOpen(false)}
            onSubmit={handleProfileUpdate}
            isLoading={isLoading}
          />

          <Footer />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
