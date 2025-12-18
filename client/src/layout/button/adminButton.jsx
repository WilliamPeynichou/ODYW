import React from "react";
import { useNavigate } from "react-router-dom";
import "./adminButton.css";

const AdminButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin");
  };

  return (
    <button onClick={handleClick} className="admin-button">
      <span aria-hidden="true">Admin</span>
      <span></span>
      <span>Admin</span>
    </button>
  );
};

export default AdminButton;

