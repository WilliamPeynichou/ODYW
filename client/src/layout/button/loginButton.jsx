import React from "react";
import { useNavigate } from "react-router-dom";
import "./loginButton.css";

const LoginButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <button onClick={handleClick} className="login-button">
      <span aria-hidden="true">Se connecter</span>
      <span></span>
      <span>Se connecter</span>
    </button>
  );
};

export default LoginButton;

