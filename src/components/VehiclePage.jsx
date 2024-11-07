import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import bikeAnimation from "../assets/Bike.json";
import vehicleAnimation from "../assets/vehicle.json";
import scooterAnimation from "../assets/scooter.json";
import wheelchairAnimation from "../assets/wheelchair.json";

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
        } catch (error) {
            console.error("Failed to fetch Thingy:", error);
        }
    };

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
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const result = await response.json();
                setIsBound(true);
                setThingy(prev => prev.map(t => t._id === thingyId ? { ...t, isAvailable: false } : t));
                alert(result.message);
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error("Failed to bind Thingy:", error);
        }
    };

    useEffect(() => {
        if (isPrinting) {
            const interval = setInterval(() => {
                fetchSensorData("TEMP");
                fetchSensorData("HUMID");
                fetchSensorData("CO2_EQUIV");
                fetchSensorData("AIR_QUAL");
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [thingy, isPrinting]);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(sensorData.temp)} p-6 transition-colors duration-1000`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between mb-6">
                    <button
                        className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition duration-300"
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('username');
                            navigate("/user/signin");
                        }}
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
                            onClick={bindThingy}
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
                </div>
            </div>
        </div>
    );
};

export default VehiclePage;