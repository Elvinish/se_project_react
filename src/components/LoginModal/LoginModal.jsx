import { useState, useEffect } from "react";
import "./LoginModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

function LoginModal({
  isOpen,
  onClose,
  onLoginSubmit,
  isLoading,
  onSwitchToRegister,
  loginError,
}) {
  const { values, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSubmit(values);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <ModalWithForm
      name="login"
      isOpen={isOpen}
      title="Log in"
      buttonText={isLoading ? "Logging in..." : "Log in"}
      onClose={onClose}
      onSubmit={handleSubmit}
      footer={
        <div className="modal__switch">
          or{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="modal__switch-button"
          >
            Sign Up
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
          id="login-email"
          required
          onChange={handleChange}
          value={values.email || ""}
        />
      </label>
      <label className="modal__label">
        {loginError ? (
          <span className="modal__error-label">Incorrect password</span>
        ) : (
          "Password"
        )}
        <input
          type="password"
          className={`modal__input ${
            loginError ? "modal__input_type_error" : ""
          }`}
          placeholder="Password"
          name="password"
          id="login-password"
          required
          onChange={handleChange}
          value={values.password || ""}
        />
      </label>
    </ModalWithForm>
  );
}

export default LoginModal;
