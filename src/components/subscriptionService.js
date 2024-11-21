const subscribeToThingyUpdates = async (type, token) => {
    try {
        const response = await fetch(`http://localhost:3000/things/${type}/subscribe`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to subscribe to ${type}: ${response.statusText}`);
        }

        console.log(`Subscribed to ${type} successfully`);
    } catch (error) {
        console.error(`Error subscribing to ${type}:`, error);
    }
};

export const subscribeToFlips = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found for flips subscription");
        return;
    }
    await subscribeToThingyUpdates("flips", token);
};

export const subscribeToButtons = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found for buttons subscription");
        return;
    }
    await subscribeToThingyUpdates("buttons", token);
};
