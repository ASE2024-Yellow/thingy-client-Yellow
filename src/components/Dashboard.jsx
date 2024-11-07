import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import bikeAnimation from "../assets/Bike.json";
import wheelchairAnimation from "../assets/wheelchair.json";
import scooterAnimation from "../assets/scooter.json";
import vehicleAnimation from "../assets/vehicle.json";

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
              { type: "bike", animation: bikeAnimation, label: "Bike" },
              { type: "wheelchair", animation: wheelchairAnimation, label: "Wheelchair" },
              { type: "scooter", animation: scooterAnimation, label: "Scooter" },
              { type: "vehicle", animation: vehicleAnimation, label: "Vehicle" },
            ].map((item) => (
              <div
                key={item.type}
                className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-md hover:transform hover:scale-105 transition duration-300 cursor-pointer"
                onClick={() => handleTransportSelect(item.type)}
              >
                <div className="w-32 h-32 mx-auto mb-4">
                  <Lottie animationData={item.animation} loop={true} />
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