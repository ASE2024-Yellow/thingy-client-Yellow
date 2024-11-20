import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import bikeAnimation from "../assets/Bike.json";
import vehicleAnimation from "../assets/vehicle.json";
import scooterAnimation from "../assets/scooter.json";
import wheelchairAnimation from "../assets/wheelchair.json";
import FlipDetection from "./FlipDetection";
import ButtonDetection from "./ButtonDetection";

const VehiclePage = () => {
    const { type } = useParams();
    const [thingy, setThingy] = useState(null);
    const [isBound, setIsBound] = useState(false);
    const [sensorData, setSensorData] = useState({
        temp: null,
        humid: null,
        co2_equiv: null,
        air_qual: null,
    });
    const [isPrinting, setIsPrinting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showFlipDetection, setShowFlipDetection] = useState(false);
    const [pastSensorData, setPastSensorData] = useState([]);
    const [highlight, setHighlight] = useState(false);
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    const animationMap = {
        bike: bikeAnimation,
        vehicle: vehicleAnimation,
        scooter: scooterAnimation,
        wheelchair: wheelchairAnimation,
    };

    const getBackgroundGradient = (temperature) => {
        if (temperature === null) return "from-pink-300 via-yellow-200 to-yellow-100";
        return temperature < 10
            ? "from-blue-300 via-blue-200 to-blue-100"
            : "from-pink-300 via-yellow-200 to-yellow-100";
    };

    useEffect(() => {
        if (!token) {
            console.warn("No token found. Redirecting to login.");
            navigate("/user/signin");
        } else {
            fetchThingy();
        }
    }, [token, navigate]);

    const fetchThingy = async () => {
        try {
            const response = await fetch("http://localhost:3000/things", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setThingy(data);
            if (data && data.length > 0) {
                bindThingy(data[0]._id); /// we need to change this all the time according to the thingy id
            }
        } catch (error) {
            console.error("Failed to fetch Thingy:", error);
        }
    };

    const bindThingy = async (thingyId) => {
        try {
            const response = await fetch(`http://localhost:3000/things/${thingyId}/bind`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            alert("Thingy bound successfully!");
            if (response.ok) {
                const result = await response.json();
                setIsBound(true);
                setThingy(prev => prev.map(t => t._id === thingyId ? { ...t, isAvailable: false } : t));
                console.log(result.message);
            } else {
                const errorData = await response.json();
                console.error(errorData.message);
            }
        } catch (error) {
            console.error("Failed to bind Thingy:", error);
        }
    };

    useEffect(() => {
        if (isBound) {
            const interval = setInterval(() => {
                fetchSensorData("TEMP");
                fetchSensorData("HUMID");
                fetchSensorData("CO2_EQUIV");
                fetchSensorData("AIR_QUAL");
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [thingy, isBound]);

    useEffect(() => {
        let interval;
        if (showHistory) {
            interval = setInterval(() => {
                fetchPastSensorData();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [showHistory]);

    const fetchSensorData = async (sensorType) => {
        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - 60000).toISOString(); // Last minute
        const thingyId = thingy && thingy[0] ? thingy[0]._id : null;

        if (!thingyId) {
            console.error("No Thingy bound.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/things/sensorData/${sensorType}?startTime=${startTime}&endTime=${endTime}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (data.length > 0) {
                const latestReading = data[data.length - 1].value;
                setSensorData(prev => ({
                    ...prev,
                    [sensorType.toLowerCase()]: latestReading
                }));
            }
        } catch (error) {
            console.error(`Failed to fetch ${sensorType} data:`, error);
        }
    };

    const fetchPastSensorData = async () => {
        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - 3600000).toISOString(); // Last hour
        const thingyId = thingy && thingy[0] ? thingy[0]._id : null;

        if (!thingyId) {
            console.error("No Thingy bound.");
            return;
        }

        try {
            const sensorTypes = ["TEMP", "HUMID", "CO2_EQUIV", "AIR_QUAL"];
            const promises = sensorTypes.map(sensorType =>
                fetch(
                    `http://localhost:3000/things/sensorData/${sensorType}?startTime=${startTime}&endTime=${endTime}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ).then(response => response.json())
            );

            const results = await Promise.all(promises);
            const combinedData = results.flat().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setPastSensorData(combinedData.slice(0, 10)); // Keep only the last 10 entries
            setHighlight(true);
            setTimeout(() => setHighlight(false), 500); // Remove highlight after 500ms
        } catch (error) {
            console.error("Failed to fetch past sensor data:", error);
        }
    };

    const handleNavigateDashboard = () => {
        navigate("/dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate("/user/signin");
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(sensorData.temp)} p-6 transition-colors duration-1000`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between mb-6">
                    <button
                        className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300"
                        onClick={handleNavigateDashboard}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-xl p-8 shadow-lg">
                    <h2 className="text-4xl font-bold mb-6 text-gray-800">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Dashboard
                    </h2>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <button
                            onClick={fetchThingy}
                            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300"
                        >
                            Get Thingy
                        </button>
                        <button
                            onClick={() => bindThingy(thingy && thingy[0] ? thingy[0]._id : null)}
                            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300"
                        >
                            Bind Thingy
                        </button>
                        <button
                            onClick={() => setIsPrinting(!isPrinting)}
                            className={`${isPrinting ? 'bg-green-500' : 'bg-yellow-500'
                                } text-black px-4 py-2 rounded-lg hover:opacity-90 transition duration-300`}
                        >
                            {isPrinting ? 'Monitoring Active' : 'Start Monitoring'}
                        </button>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-300"
                        >
                            {showHistory ? "Hide Past History" : "Show Past History"}
                        </button>
                        <button
                            onClick={() => setShowFlipDetection(!showFlipDetection)}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition duration-300"
                        >
                            {showFlipDetection ? "Hide Flip Detection" : "Show Flip Detection"}
                        </button>
                    </div>

                    {isPrinting && (
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="grid gap-6 text-gray-800 mb-6 md:mb-0">
                                <div className="text-8xl font-bold tracking-tight">
                                    {sensorData.temp !== null ? `${sensorData.temp}°C` : '--°C'}
                                </div>

                                <div className="space-y-2 text-2xl">
                                    <div className="font-light">
                                        Humidity: {sensorData.humid !== null ? `${sensorData.humid}%` : '--'}
                                    </div>
                                    <div className="font-light">
                                        CO₂ level: {sensorData.co2_equiv !== null ? `${sensorData.co2_equiv}` : '--'}
                                    </div>
                                    <div className="font-light">
                                        Air Quality: {sensorData.air_qual !== null ? sensorData.air_qual : '--'}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`w-full md:w-1/2 max-w-xs transition-all duration-500 ${sensorData.humid > 50 ? 'blur-sm bg-white bg-opacity-20' : ''
                                    }`}
                            >
                                <Lottie animationData={animationMap[type]} loop={true} />
                            </div>
                        </div>
                    )}

                    {showHistory && (
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Past Sensor Data</h3>
                            <ul className="space-y-2">
                                {pastSensorData.map((data, index) => (
                                    <li key={index} className={`bg-white bg-opacity-50 p-4 rounded-lg shadow transition duration-300 ${highlight ? 'ring-2 ring-yellow-500' : ''}`}>
                                        {data.type === "TEMP" && `Temp: ${data.value}`}
                                        {data.type === "HUMID" && `Humid: ${data.value}`}
                                        {data.type === "CO2_EQUIV" && `CO2: ${data.value}`}
                                        {data.type === "AIR_QUAL" && `Air Quality: ${data.value}`}
                                        <br />
                                        <span className="text-sm text-gray-600">Time: {new Date(data.timestamp).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {showFlipDetection && <FlipDetection token={token} />}
                    {isBound && <ButtonDetection token={token} />}
                </div>
            </div>
        </div>
    );
};

export default VehiclePage;