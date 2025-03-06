import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

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

import { getItems, postItem, deleteItem } from "../../utils/api";

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

  const closeActiveModal = () => {
    setActiveModal(""); // ✅ Ensure all modals are closed
    setisDeleteModalOpen(false); // ✅ Close delete confirmation modal too
    setItemToDelete(null); // ✅ Reset itemToDelete state
  };

  // const handleDeleteItem = (itemId) => {
  //   console.log("Attempting to delete item with ID:", itemId);
  //   return deleteItem(itemId)
  //     .then(() => {
  //       setClothingItems((prevItems) =>
  //         prevItems.filter((item) => item._id !== itemId)
  //       );
  //     })
  //     .catch((err) => console.error("Error deleting item:", err));
  // };

  const handleConfirmDelete = () => {
    console.log("Confirm delete clicked! itemToDelete:", itemToDelete);
    if (!itemToDelete) return; // Exit if there's no item to delete

    deleteItem(itemToDelete) // Directly call deleteItem
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

    postItem({ name, imageUrl, weather }) // Send to backend
      .then((newItem) => {
        setClothingItems((prevItems) =>
          prevItems ? [newItem, ...prevItems] : [newItem]
        );
        closeActiveModal();
      })
      .catch((err) => console.error("Error adding item:", err))
      .finally(() => {
        setIsLoading(false);
      });
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

  // useEffect(() => {
  //   if (!activeModal) return; // Only add listener if a modal is active

  //   const handleEscClose = (e) => {
  //     if (e.key === "Escape") {
  //       closeActiveModal();
  //     }
  //   };

  //   document.addEventListener("keydown", handleEscClose);

  //   return () => {
  //     document.removeEventListener("keydown", handleEscClose);
  //   };
  // }, [activeModal]);

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className="page">
        <div className="page__content">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
          <Routes>
            <Route
              path="/"
              element={
                isWeatherDataLoading ? ( // Conditional rendering based on loading state
                  <p>Loading weather data...</p> // Show loading message
                ) : (
                  //pass clothingitems as prop
                  <Main
                    weatherData={weatherData}
                    onCardClick={handleCardClick}
                    clothingItems={clothingItems}
                  />
                )
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  onCardClick={handleCardClick}
                  clothingItems={clothingItems}
                  weatherData={weatherData}
                  onAddNew={handleAddClick}
                />
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

        <Footer />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
