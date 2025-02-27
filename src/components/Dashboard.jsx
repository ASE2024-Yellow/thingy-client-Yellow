import React from "react";
import { useNavigate } from "react-router-dom";
import bikeImage from "../assets/Bike.png";
import wheelchairImage from "../assets/wheelchair.png";
import scooterImage from "../assets/scooter.png";
import vehicleImage from "../assets/vehicle.png";

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-yellow-500 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <header className="bg-yellow-500 text-black p-4 rounded-lg shadow-lg mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold">
              Welcome, {username ? username : "Guest"}!
            </h2>
          </header>
          <div className="flex space-x-4">
            <button
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300 font-semibold"
              onClick={handleProfile}
            >
              Profile
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 font-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
            {(username === "professor" || username === "william") && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold"
                onClick={handleGetUsers}
              >
                Get Users
              </button>
            )}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 p-8 rounded-xl shadow-2xl backdrop-blur-md">
          <h3 className="text-2xl font-bold text-yellow-300 mb-6 text-center">
            Select Your Transport Type:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "bike", image: bikeImage, label: "Bike" },
              { type: "wheelchair", image: wheelchairImage, label: "Wheelchair" },
              { type: "scooter", image: scooterImage, label: "Scooter" },
              { type: "vehicle", image: vehicleImage, label: "Vehicle" },
            ].map((item) => (
              <div
                key={item.type}
                className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-md hover:transform hover:scale-105 transition duration-300 cursor-pointer"
                onClick={() => handleTransportClick(item.type)}
              >
                <div className="w-32 h-32 mx-auto mb-4">
                  <img src={item.image} alt={item.label} className="w-full h-full object-contain" />
                </div>
                <p className="text-yellow-300 font-semibold text-center">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
