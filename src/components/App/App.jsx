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

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-clothes");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleOpenDeleteModal = (item) => {
    console.log("Opening delete modal for item:", item);
    setItemToDelete(item._id); // Save the item's ID
    // Also close the preview modal if needed
    setActiveModal("");
    setisDeleteModalOpen(true);
  };

  const handleDeleteItem = (itemId) => {
    console.log("Attempting to delete item with ID:", itemId);
    return deleteItem(itemId)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      })
      .catch((err) => console.error("Error deleting item:", err));
  };

  const handleConfirmDelete = () => {
    console.log("Confirm delete clicked! itemToDelete:", itemToDelete);
    if (itemToDelete === null) return;

    handleDeleteItem(itemToDelete).then(() => {
      // After deletion, close both modals and reset the delete state
      setActiveModal("");
      setisDeleteModalOpen(false);
      setItemToDelete(null);
    });
  };

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    if (!clothingItems) {
      console.error("Clothing items not loaded yet.");
      return;
    }

    postItem({ name, imageUrl, weather }) // Send to backend
      .then((newItem) => {
        setClothingItems((prevItems) =>
          prevItems ? [newItem, ...prevItems] : [newItem]
        );
        closeActiveModal();
      })
      .catch((err) => console.error("Error adding item:", err));
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
                    onDeleteItem={handleDeleteItem}
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
          isOpen={activeModal === "add-clothes"}
          onClose={closeActiveModal}
          onAddItemModalSubmit={handleAddItemModalSubmit}
        />

        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeActiveModal}
          onDelete={handleOpenDeleteModal}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            console.log("Cancel clicked");
            setisDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        <Footer />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
