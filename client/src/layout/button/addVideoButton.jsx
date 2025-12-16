import React from "react";
import { useNavigate } from "react-router-dom";
import "./addVideoButton.css";

const AddVideoButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/add-video");
  };

  return (
    <button onClick={handleClick} className="add-video-button">
      <span aria-hidden="true">+ Ajouter une Video</span>
      <span></span>
      <span>+ Ajouter une Video</span>
    </button>
  );
};

export default AddVideoButton;