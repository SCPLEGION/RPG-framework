import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [ticketCount, setTicketCount] = useState(0);
    const [usercountstatus, setcountstatus] = useState(null);
    const [ticketcountstatus, setticketcountstatus] = useState(null);

    useEffect(() => {
        // Fetch user count from your backend or Discord API
        fetch("/api/discord/user-count")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    setcountstatus(response.status);
                    throw new Error(`Error: ${response.status}`);
                }
            })
            .then((data) => setUserCount(data.count))
            .catch((error) => console.error("Error fetching user count:", error));

        // Fetch ticket count from your backend
        fetch("/api/tickets/count")
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    setticketcountstatus(response.status);
                    throw new Error(`Error: ${response.status}`);
                }
            })
            .then((data) => setTicketCount(data.count))
            .catch((error) => console.error("Error fetching ticket count:", error));
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Dashboard</h1>
            <div style={{ marginTop: "20px" }}>
                <h2>Discord Server Stats</h2>
                <p>
                    Total Users:{" "}
                    {usercountstatus === null ? (
                        userCount !== null ? (
                            userCount
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )
                    ) : (
                        <Skeleton variant="text" width={100} />
                    )}
                </p>
                <p>
                    Total Tickets:{" "}
                    {ticketcountstatus === null ? (
                        ticketCount !== null ? (
                            ticketCount
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )
                    ) : (
                        <Skeleton variant="text" width={100} />
                    )}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;