import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [ticketCount, setTicketCount] = useState(0);

    useEffect(() => {
        // Fetch user count from your backend or Discord API
        fetch("/api/discord/user-count")
            .then((response) => response.json())
            .then((data) => setUserCount(data.count))
            .catch((error) => console.error("Error fetching user count:", error));

        // Fetch ticket count from your backend
        fetch("/api/tickets/count")
            .then((response) => response.json())
            .then((data) => setTicketCount(data.count))
            .catch((error) => console.error("Error fetching ticket count:", error));
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Dashboard</h1>
            <div style={{ marginTop: "20px" }}>
                <h2>Discord Server Stats</h2>
                <p>Total Users: {userCount}</p>
                <p>Total Tickets: {ticketCount}</p>
            </div>
        </div>
    );
};

export default Dashboard;