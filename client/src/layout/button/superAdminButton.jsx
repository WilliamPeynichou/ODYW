import React from "react";
import { useNavigate } from "react-router-dom";
import "./superAdminButton.css";

const SuperAdminButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/superadmin");
  };

  return (
    <button onClick={handleClick} className="super-admin-button">
      <span aria-hidden="true">SuperAdmin</span>
      <span></span>
      <span>SuperAdmin</span>
    </button>
  );
};

export default SuperAdminButton;

