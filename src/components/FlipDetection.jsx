import React, { useEffect, useState, useRef } from "react";
import { subscribeToFlips } from "./subscriptionService";

const FlipDetection = ({ token }) => {
    const [flipData, setFlipData] = useState([]);
    const [highlight, setHighlight] = useState(false);
    const [currentFlipState, setCurrentFlipState] = useState("");
    const [timer, setTimer] = useState(0);
    const [ledColor, setLedColor] = useState('blue');
    const timerRef = useRef(null);
    const ledTimerRef = useRef(null);

    

    useEffect(() => {
        const initiateSubscription = async () => {
            await subscribeToFlips(); // Automatically subscribes on mount
        };
        
        initiateSubscription();
        fetchFlipData();
        const interval_button = setInterval(handleButtonPress, 1000); // Check button press every 1 second
        const interval_flip = setInterval(fetchFlipData, 1000); // Fetch data every 1 seconds
        return () => {
            clearInterval(interval_button);
            clearInterval(interval_flip);
        }
    }, []);

    const fetchFlipData = async () => {
        try {
            const response = await fetch("http://localhost:3000/things/flips", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            // console.log("Fetched data:", data); // Log the fetched data
            const latestData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10); // Sort by timestamp and keep only the last 10 entries
            // console.log("Latest data:", latestData); // Log the latest data
            setFlipData(latestData);
            setHighlight(true);
            setTimeout(() => {
                setHighlight(false);
                setFlipData([...latestData]); // Force re-render by updating state
                // console.log("Updated flipData state:", latestData); // Log the updated state
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
            // console.log("Button data:", data); // Log the fetched data
            const latestButtonState = data.length > 0 ? data[data.length - 1].value : null;
            // console.log("Latest button state:", latestButtonState); // Log the latest button state
            if (latestButtonState === "1") {
                setTimer(0); // Reset the timer on button press
            }
        } catch (error) {
            console.error("Failed to fetch button data:", error);
        }
    };

    const changeLedColor = async (color) => {
        try {
            const response = await fetch(`http://localhost:3000/things/LED/setColor/${color}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Failed to change LED color:", error);
        }
    };

    useEffect(() => {
        fetchFlipData();
        const interval = setInterval(fetchFlipData, 1000); // Fetch data every 1 second
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        handleButtonPress();
        const interval = setInterval(handleButtonPress, 1000); // Fetch data every 1 second
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (currentFlipState === "ON_SIDE" || currentFlipState === "UPSIDE_DOWN") {
            // Reset the timer and start a new one for ON_SIDE or UPSIDE_DOWN
            clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);

            // Start changing LED color every 10 seconds
            clearInterval(ledTimerRef.current);
            ledTimerRef.current = setInterval(() => {
                const newColor = ledColor === 'blue' ? 'red' : ledColor === 'red' ? 'green' : 'blue';
                setLedColor(newColor);
                changeLedColor(newColor);
            }, 10000); // Change color every 10 seconds

        } else {
            // Reset the timer and stop it for NORMAL
            clearInterval(timerRef.current);
            setTimer(0);

            // Stop changing LED color
            clearInterval(ledTimerRef.current);
        }

        return () => {
            clearInterval(timerRef.current); // Cleanup
            clearInterval(ledTimerRef.current); // Cleanup
        };
    }, [currentFlipState]);



    //LED change
    useEffect(() => {

        if (timer >= 10) {
            // Set LED to red after 10 seconds
            fetch("http://localhost:3000/things/LED/setColor/red", {
                method: "POST",
                headers: {
                    //"Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        // console.log("LED color set to red successfully:", data);
                    } else {
                        console.error("Failed to set LED color:", data.message);
                    }
                })
                .catch((error) => console.error("Error calling the LED API:", error));
        } else {

            // else Set LED to green
            fetch("http://localhost:3000/things/LED/setColor/green", {
                method: "POST",
                headers: {
                    //"Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
        }

    }, [timer, currentFlipState]);


    //buzzer 
    
    useEffect(() => {
        if (timer == 11 && (currentFlipState === "ON_SIDE" || currentFlipState === "UPSIDE_DOWN")) {
            // Set buzzer on at 20 seconds
            fetch("http://localhost:3000/things/buzzer/on", {
                method: "POST",
                headers: {
                    //"Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        console.log("LED color set to red successfully:", data);
                    } else {
                        console.error("Failed to set LED color:", data.message);
                    }
                })
                .catch((error) => console.error("Error calling the LED API:", error));
        } else {

            // else Set buzzer off
            fetch("http://localhost:3000/things/buzzer/off", {
                method: "POST",
                headers: {
                    //"Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

        }

    }, [timer, currentFlipState]);
    


    //alert

    useEffect(() => {
        if (timer >= 30 && (currentFlipState === "ON_SIDE" || currentFlipState === "UPSIDE_DOWN")) {
            alert(`Flip state has been ${currentFlipState} for more than 30 seconds! EMERGENCY CALL STARTING!`);

            setTimer(0); // Reset the timer after alert
        }

    }, [timer, currentFlipState]);




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