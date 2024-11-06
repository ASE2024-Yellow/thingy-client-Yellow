import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/VehiclePage.css";

const VehiclePage = () => {
  const { type } = useParams();
  const [thingy, setThingy] = useState(null);
  const [isBound, setIsBound] = useState(false);
  const [temperatureData, setTemperatureData] = useState([]); // State for temperature data
  const [humidityData, setHumidityData] = useState([]); // State for humidity data
  const [co2Data, setCo2Data] = useState([]); // State for CO2 data
  const [airQualData, setAirQualData] = useState([]); // State for air quality data
  const [isPrinting, setIsPrinting] = useState(false); // State to control data fetching
  const token = localStorage.getItem("token"); // Retrieve token
  const username = localStorage.getItem("username"); // Retrieve username from localStorage (if stored)
  const navigate = useNavigate(); // Initialize navigate
  const tempEndRef = useRef(null); // Ref to scroll to the bottom of temperature data
  const humidEndRef = useRef(null); // Ref to scroll to the bottom of humidity data
  const co2EndRef = useRef(null); // Ref to scroll to the bottom of CO2 data
  const airQualEndRef = useRef(null); // Ref to scroll to the bottom of air quality data

  // Check for token and fetch Thingy
  useEffect(() => {
    if (!token) {
      console.warn("No token found. Redirecting to login.");
      navigate("/user/signin"); // Redirect to login if token is missing
    } else {
      fetchThingy(); // Fetch Thingy data if token is present
    }
  }, [token, navigate]); // Add navigate to the dependency array

  // Fetch Thingy
  const fetchThingy = async () => {
    try {
      const response = await fetch("http://localhost:3000/things", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setThingy(data);
      console.log("Current token:", token); // Print current token
      console.log("Thingy ID:", data[0] ? data[0]._id : "No Thingy found"); // Print Thingy ID
    } catch (error) {
      console.error("Failed to fetch Thingy:", error);
    }
  };

  // Fetch Temperature Data
  const fetchTemperatureData = async () => {
    const endTime = new Date().toISOString(); // Current time
    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
    const thingyId = thingy && thingy[0] ? thingy[0]._id : null;

    if (!thingyId) {
      console.error("No Thingy bound.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/things/sensorData/TEMP?startTime=${startTime}&endTime=${endTime}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        setTemperatureData((prevData) => {
          const updatedData = [...prevData, ...data].slice(-50); // Keep only the last 50 entries
          return updatedData;
        });
        console.log("Temperature data fetched:", data);
      } else {
        console.warn("No temperature data available for the selected time period.");
      }
    } catch (error) {
      console.error("Failed to fetch temperature data:", error);
    }
  };

  // Fetch Humidity Data
  const fetchHumidityData = async () => {
    const endTime = new Date().toISOString(); // Current time
    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
    const thingyId = thingy && thingy[0] ? thingy[0]._id : null;

    if (!thingyId) {
      console.error("No Thingy bound.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/things/sensorData/HUMID?startTime=${startTime}&endTime=${endTime}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        setHumidityData((prevData) => {
          const updatedData = [...prevData, ...data].slice(-50); // Keep only the last 50 entries
          return updatedData;
        });
        console.log("Humidity data fetched:", data);
      } else {
        console.warn("No humidity data available for the selected time period.");
      }
    } catch (error) {
      console.error("Failed to fetch humidity data:", error);
    }
  };

  // Fetch CO2 Data
  const fetchCo2Data = async () => {
    const endTime = new Date().toISOString(); // Current time
    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
    const thingyId = thingy && thingy[0] ? thingy[0]._id : null;

    if (!thingyId) {
      console.error("No Thingy bound.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/things/sensorData/CO2_EQUIV?startTime=${startTime}&endTime=${endTime}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        setCo2Data((prevData) => {
          const updatedData = [...prevData, ...data].slice(-50); // Keep only the last 50 entries
          return updatedData;
        });
        console.log("CO2 data fetched:", data);
      } else {
        console.warn("No CO2 data available for the selected time period.");
      }
    } catch (error) {
      console.error("Failed to fetch CO2 data:", error);
    }
  };

  // Fetch Air Quality Data
  const fetchAirQualData = async () => {
    const endTime = new Date().toISOString(); // Current time
    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
    const thingyId = thingy && thingy[0] ? thingy[0]._id : null;

    if (!thingyId) {
      console.error("No Thingy bound.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/things/sensorData/AIR_QUAL?startTime=${startTime}&endTime=${endTime}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        setAirQualData((prevData) => {
          const updatedData = [...prevData, ...data].slice(-50); // Keep only the last 50 entries
          return updatedData;
        });
        console.log("Air quality data fetched:", data);
      } else {
        console.warn("No air quality data available for the selected time period.");
      }
    } catch (error) {
      console.error("Failed to fetch air quality data:", error);
    }
  };

  // Bind Thingy to User
  const bindThingy = async () => {
    if (!thingy || !thingy[0]) {
      console.warn("No Thingy to bind.");
      return;
    }

    const thingyId = thingy[0]._id;
    try {
      const response = await fetch(`http://localhost:3000/things/${thingyId}/bind`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Add content type header
        },
      });

      if (response.ok) {
        const result = await response.json(); // Get the response data
        console.log(`Thingy bound to user: ${username} with token: ${token}`); // Print message when bound
        console.log("Binding response:", result); // Log the binding response
        
        // Update the UI state based on the binding result
        setIsBound(true); // Set bound status to true
        setThingy(prev => prev.map(t => t._id === thingyId ? { ...t, isAvailable: false } : t)); // Update the Thingy state
        alert(result.message); // Optional: Show alert with success message
      } else {
        const errorData = await response.json(); // Get error message from response
        console.error("Failed to bind Thingy:", errorData.message); // Log error message
        alert(errorData.message); // Optional: Show alert with error message
      }
    } catch (error) {
      console.error("Failed to bind Thingy:", error);
    }
  };

  // Start fetching sensor data every few seconds when printing is enabled
  useEffect(() => {
    if (isPrinting) {
      const interval = setInterval(() => {
        fetchTemperatureData();
        fetchHumidityData();
        fetchCo2Data();
        fetchAirQualData();
      }, 2000); // Fetch data every 2 seconds
      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [thingy, isPrinting]); // Run effect when `thingy` or `isPrinting` changes

  // Scroll to the bottom of the data list when it updates
  useEffect(() => {
    tempEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [temperatureData]);

  useEffect(() => {
    humidEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [humidityData]);

  useEffect(() => {
    co2EndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [co2Data]);

  useEffect(() => {
    airQualEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [airQualData]);

  return (
    <div className="vehicle-page">
      <div className="top-section">
        <div className="top-buttons">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="logout-button" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            navigate("/user/signin");
          }}>
            Logout
          </button>
        </div>
    
        <h2>You selected: {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <p className="selected-transport">You are riding a {type.charAt(0).toUpperCase() + type.slice(1)}</p>
    
        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={fetchThingy} className="action-button">
            Get Thingy
          </button>
          <button onClick={bindThingy} className="action-button">
            Bind Thingy
          </button>
          <button onClick={() => setIsPrinting(true)} className="action-button">
            Print Sensor Data
          </button>
        </div>
      </div>
  
      {/* Sensor Data Boxes */}
      {isPrinting && (
        <div className="sensor-data-container">
          {/* Box for Temperature Data */}
          <div className="sensor-data-box">
            {temperatureData.length > 0 && (
              <>
                <h3>Temperature Data:</h3>
                <ul>
                  {temperatureData.map((data, index) => (
                    <li key={index}>
                      Time: {new Date(data.timestamp).toLocaleString()}, Temperature: {data.value}
                    </li>
                  ))}
                </ul>
                <div ref={tempEndRef} /> {/* Reference to scroll into view */}
              </>
            )}
          </div>

          {/* Box for Humidity Data */}
          <div className="sensor-data-box">
            {humidityData.length > 0 && (
              <>
                <h3>Humidity Data:</h3>
                <ul>
                  {humidityData.map((data, index) => (
                    <li key={index}>
                      Time: {new Date(data.timestamp).toLocaleString()}, Humidity: {data.value}
                    </li>
                  ))}
                </ul>
                <div ref={humidEndRef} /> {/* Reference to scroll into view */}
              </>
            )}
          </div>

          {/* Box for CO2 Data */}
          <div className="sensor-data-box">
            {co2Data.length > 0 && (
              <>
                <h3>CO2 Data:</h3>
                <ul>
                  {co2Data.map((data, index) => (
                    <li key={index}>
                      Time: {new Date(data.timestamp).toLocaleString()}, CO2: {data.value}
                    </li>
                  ))}
                </ul>
                <div ref={co2EndRef} /> {/* Reference to scroll into view */}
              </>
            )}
          </div>

          {/* Box for Air Quality Data */}
          <div className="sensor-data-box">
            {airQualData.length > 0 && (
              <>
                <h3>Air Quality Data:</h3>
                <ul>
                  {airQualData.map((data, index) => (
                    <li key={index}>
                      Time: {new Date(data.timestamp).toLocaleString()}, Air Quality: {data.value}
                    </li>
                  ))}
                </ul>
                <div ref={airQualEndRef} /> {/* Reference to scroll into view */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VehiclePage;