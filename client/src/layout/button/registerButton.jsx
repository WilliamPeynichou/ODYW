import React from "react";
import { useNavigate } from "react-router-dom";
import "./registerButton.css";

const RegisterButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <button onClick={handleClick} className="register-button">
      <span aria-hidden="true">S'inscrire</span>
      <span></span>
      <span>S'inscrire</span>
    </button>
  );
};

export default RegisterButton;

