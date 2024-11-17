import React, { useEffect, useState, useRef } from "react";

const FlipDetection = ({ token }) => {
    const [flipData, setFlipData] = useState([]);
    const [highlight, setHighlight] = useState(false);
    const [currentFlipState, setCurrentFlipState] = useState('');
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);

    const fetchFlipData = async () => {
        try {
            const response = await fetch("http://localhost:3000/things/flips", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched data:", data); // Log the fetched data
            const latestData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10); // Sort by timestamp and keep only the last 10 entries
            console.log("Latest data:", latestData); // Log the latest data
            setFlipData(latestData);
            setHighlight(true);
            setTimeout(() => {
                setHighlight(false);
                setFlipData([...latestData]); // Force re-render by updating state
                console.log("Updated flipData state:", latestData); // Log the updated state
            }, 500); // Remove highlight after 500ms

            // Handle flip state
            const latestFlipState = latestData[0]?.value;
            if (latestFlipState !== currentFlipState) {
                setCurrentFlipState(latestFlipState);
            }
        } catch (error) {
            console.error("Failed to fetch flip data:", error);
        }
    };

    const handleButtonPress = async () => {
        try {
            const response = await fetch("http://localhost:3000/things/buttons", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const latestButtonState = data.length > 0 ? data[data.length - 1].value : null;
            if (latestButtonState === "1") {
                setTimer(0); // Reset the timer on button press
            }
        } catch (error) {
            console.error("Failed to fetch button data:", error);
        }
    };

    useEffect(() => {
        fetchFlipData();
        const interval = setInterval(fetchFlipData, 5000); // Fetch data every 5 seconds
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (currentFlipState === "ON_SIDE" || currentFlipState === "UPSIDE_DOWN") {
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setTimer(prev => prev + 1);
                }, 1000);
            }
        } else {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setTimer(0);
        }

        return () => clearInterval(timerRef.current);
    }, [currentFlipState]);

    useEffect(() => {
        if (timer >= 30 && (currentFlipState === "ON_SIDE" || currentFlipState === "UPSIDE_DOWN")) {
            alert(`Flip state has been ${currentFlipState} for more than 30 seconds!`);
            setTimer(0); // Reset the timer after alert
        }
    }, [timer, currentFlipState]);

    useEffect(() => {
        const interval = setInterval(handleButtonPress, 1000); // Check button press every second
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Flip Detection Data</h3>
            <div className="mb-4">
                <p>Current Flip State: {currentFlipState} </p>
                <p>Timer: {timer} seconds</p>
            </div>
            <ul className="space-y-2">
                {flipData.map((data, index) => (
                    <li key={index} className={`bg-white bg-opacity-50 p-4 rounded-lg shadow transition duration-300 ${highlight ? 'ring-2 ring-yellow-500' : ''}`}>
                        {`Flip State: ${data.value}`}
                        <br />
                        <span className="text-sm text-gray-600">Time: {new Date(data.timestamp).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlipDetection;