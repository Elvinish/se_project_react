import { useEffect } from "react";
import "./AddItemModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

export default function AddItemModal({
  isOpen,
  onClose,
  onAddItemModalSubmit,
  isLoading,
}) {
  const { values, handleChange, resetForm } = useForm({
    name: "",
    imageUrl: "",
    weather: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure submission is treated as a promise
    Promise.resolve(onAddItemModalSubmit(values))
      .then(() => {
        resetForm(); // ✅ Reset only after successful submission
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      });
  };

  useEffect(() => {
    if (isOpen) {
      resetForm(); // ✅ Reset form only when modal opens
    }
  }, [isOpen]);

  return (
    <ModalWithForm
      name="add-garment"
      isOpen={isOpen}
      title="New garment"
      buttonText={isLoading ? "Saving..." : "Add garment"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label htmlFor="name" className="modal__label">
        Name{" "}
        <input
          type="text"
          className="modal__input"
          placeholder="Name"
          name="name"
          id="clothing-name"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.name || ""}
        />
      </label>
      <label htmlFor="imageUrl" className="modal__label">
        Image{" "}
        <input
          type="url"
          name="imageUrl"
          className="modal__input"
          id="clothing-link"
          placeholder="Image URL"
          required
          onChange={handleChange}
          value={values.imageUrl || ""}
        />
      </label>
      <fieldset className="modal__radio-buttons">
        <legend className="modal__legend">Select the weather type:</legend>
        {["hot", "warm", "cold"].map((weatherType) => (
          <label
            key={weatherType}
            htmlFor={weatherType}
            className="modal__label modal__label_type_radio"
          >
            <input
              id={weatherType}
              type="radio"
              name="weather"
              className="modal__radio-input"
              value={weatherType}
              onChange={handleChange} // 🔥 Replaces handleWeatherChange
              checked={values.weather === weatherType} // 🔥 Controlled input
            />
            <span className="modal__radio-text">
              {weatherType.charAt(0).toUpperCase() + weatherType.slice(1)}
            </span>
          </label>
        ))}
      </fieldset>
    </ModalWithForm>
  );
}
