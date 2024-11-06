import React from "react";
import { useNavigate } from "react-router-dom";
import bikeImage from "../assets/Bike.jpeg";
import carImage from "../assets/car.jpeg";
import busImage from "../assets/bus.jpeg";
import trainImage from "../assets/train.jpeg";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/user/signin");
  };

  const handleProfile = () => {
    navigate("/user/profile");
  };

  const handleGetUsers = () => {
    navigate("/users");
  };

  const handleTransportClick = (type) => {
    navigate(`/vehicle/${type}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {username}</h1>
        <div className="dashboard-buttons">
          <button className="dashboard-button" onClick={handleProfile}>
            Profile
          </button>
          <button className="dashboard-button" onClick={handleGetUsers}>
            Users
          </button>
          <button className="dashboard-button logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="transport-options">
        <div className="transport-option" onClick={() => handleTransportClick("bike")}>
          <img src={bikeImage} alt="Bike" />
          <p>Bike</p>
        </div>
        <div className="transport-option" onClick={() => handleTransportClick("car")}>
          <img src={carImage} alt="Car" />
          <p>Car</p>
        </div>
        <div className="transport-option" onClick={() => handleTransportClick("bus")}>
          <img src={busImage} alt="Bus" />
          <p>Bus</p>
        </div>
        <div className="transport-option" onClick={() => handleTransportClick("train")}>
          <img src={trainImage} alt="Train" />
          <p>Train</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
