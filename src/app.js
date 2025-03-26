import express from "express";
import { loadTickets } from "./modules/database.js";

const app = express();
const PORT = 3000;

// Middleware to serve static files (optional, for styling)
app.use(express.static("public"));

// Route to fetch all tickets
app.get("/tickets", async (req, res) => {
    try {
        const tickets = await loadTickets();
        res.json(tickets);
    } catch (error) {
        console.error("Error loading tickets:", error);
        res.status(500).json({ error: "Failed to load tickets" });
    }
});

// Route to fetch a specific ticket by ID
app.get("/tickets/:id", async (req, res) => {
    try {
        const tickets = await loadTickets();
        const ticket = tickets.find(t => t.id === parseInt(req.params.id));
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ error: "Ticket not found" });
        }
    } catch (error) {
        console.error("Error loading ticket:", error);
        res.status(500).json({ error: "Failed to load ticket" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Ticket viewer app is running at http://localhost:${PORT}`);
});