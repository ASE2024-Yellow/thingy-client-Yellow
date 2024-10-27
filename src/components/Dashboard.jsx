import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Lottie from "lottie-react";
import bikeAnimation from "../assets/Bike.json"; // Path to your Lottie JSON file
import wheelchairAnimation from "../assets/wheelchair.json"; // Path to your Lottie JSON file
import scooterAnimation from "../assets/scooter.json"; // Path to your Lottie JSON file
import vehicleAnimation from "../assets/vehicle.json"; // Path to your Lottie JSON file



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

  const handleTransportSelect = (transportType) => {
    console.log(`Selected transport type: ${transportType}`);
  };

  return (
    <div className="dashboard-container ">
      <div className="top-buttons">
        {/* Welcome message */}
        <div>
          <header className="dashboard-header">
            <h2 className="welcome-message">
              Welcome, {username ? username : "Guest"}!
            </h2>
          </header>
        </div>
        {/* Profile button */}
        <div>
          <button className="profile-button mx-5" onClick={handleProfile}>
            Profile
          </button>

          {/* Logout button */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          {/* Get Users button, only visible for "professor" */}
          {username === "professor" || username === "william" && (
            <button className="get-users-button" onClick={handleGetUsers}>
              Get Users
            </button>
          )}

        </div>

      </div>



      {/* Transport selection */}
      <div className="transport-selection">
        <h3 className="text-xl font-bold pb-4">Select Your Transport Type:</h3>
        <div className="transport-options">
          <div
            className="transport-option"
            onClick={() => handleTransportSelect("bike")}
          >
            <Lottie animationData={bikeAnimation} loop={true} />
            <p>Bike</p>
          </div>
          <div
            className="transport-option"
            onClick={() => handleTransportSelect("wheelchair")}
          >
            <Lottie animationData={wheelchairAnimation} loop={true} />
            <p>Wheelchair</p>
          </div>
          <div
            className="transport-option"
            onClick={() => handleTransportSelect("bus")}
          >
            <Lottie animationData={scooterAnimation} loop={true} />
            <p>Scooter</p>
          </div>
          <div
            className="transport-option"
            onClick={() => handleTransportSelect("train")}
          >
            <Lottie animationData={vehicleAnimation} loop={true} />
            <p>Vehicle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;