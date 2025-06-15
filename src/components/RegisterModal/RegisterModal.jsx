import { useEffect, useState } from "react";
import "./RegisterModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

function RegisterModal({
  isOpen,
  onClose,
  onRegisterSubmit,
  isLoading,
  onSwitchToLogin,
}) {
  const { values, handleChange, resetForm } = useForm({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    onRegisterSubmit(values);
  }

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <ModalWithForm
      name="register"
      isOpen={isOpen}
      title="Sign up"
      buttonText={isLoading ? "Signing up..." : "Sign up"}
      onClose={onClose}
      onSubmit={handleSubmit}
      footer={
        <div className="modal__switch">
          or{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="modal__switch-button"
          >
            Log In
          </button>
        </div>
      }
    >
      <label className="modal__label">
        Email
        <input
          type="email"
          className="modal__input"
          placeholder="Email"
          name="email"
          id="register-email"
          required
          onChange={handleChange}
          value={values.email || ""}
        />
      </label>
      <label className="modal__label">
        Password
        <input
          type="password"
          className="modal__input"
          placeholder="Password"
          name="password"
          id="register-password"
          required
          onChange={handleChange}
          value={values.password || ""}
        />
      </label>
      <label className="modal__label">
        Name
        <input
          type="text"
          className="modal__input"
          placeholder="Name"
          name="name"
          id="register-name"
          required
          onChange={handleChange}
          value={values.name || ""}
        />
      </label>
      <label className="modal__label">
        Avatar URL
        <input
          type="url"
          className="modal__input"
          placeholder="Avatar URL"
          name="avatar"
          id="register-avatar"
          onChange={handleChange}
          value={values.avatar || ""}
        />
      </label>
    </ModalWithForm>
  );
}

export default RegisterModal;
