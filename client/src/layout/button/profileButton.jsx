import React from "react";
import { useNavigate } from "react-router-dom";
import "./profileButton.css";

const ProfileButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <button onClick={handleClick} className="profile-button">
      <span aria-hidden="true">Profil</span>
      <span></span>
      <span>Profil</span>
    </button>
  );
};

export default ProfileButton;
