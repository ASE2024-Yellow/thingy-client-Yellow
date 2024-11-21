// ButtonDetection.jsx
import React, { useEffect, useState } from "react";
import { subscribeToButtons } from "./subscriptionService";

const ButtonDetection = ({ token }) => {
    const [lastButtonState, setLastButtonState] = useState(null);

    useEffect(() => {
        const initiateSubscription = async () => {
            await subscribeToButtons(); // Automatically subscribes on mount
        };
        initiateSubscription();
        fetchButtonData();
        const interval = setInterval(fetchButtonData, 3000); // Fetch data every 3 seconds
        return () => clearInterval(interval);
    }, []);
    const fetchButtonData = async () => {
        try {
            const response = await fetch("http://localhost:3000/things/buttons", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            // Check the latest button state
            const latestButtonState = data.length > 0 ? data[data.length - 1].value : null;
            if (latestButtonState !== lastButtonState) {
                setLastButtonState(latestButtonState);
                if (latestButtonState === "1") {
                    alert("Emergency service needed!");
                }
            }
        } catch (error) {
            console.error("Failed to fetch button data:", error);
        }
    };

    useEffect(() => {
        fetchButtonData();
        const interval = setInterval(fetchButtonData, 3000); // Fetch data every 5 seconds
        return () => clearInterval(interval);
    }, [token, lastButtonState]);

    return null;
};

export default ButtonDetection;