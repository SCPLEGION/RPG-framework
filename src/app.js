import express from "express";
import { loadTickets } from "./modules/database.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Route to update a specific ticket by ID
app.put("/tickets/:id", async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        const updatedData = req.body;

        const tickets = await loadTickets();
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);

        if (ticketIndex === -1) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        // Update the ticket
        tickets[ticketIndex] = { ...tickets[ticketIndex], ...updatedData };
        await saveTickets(tickets);

        res.status(200).json({ message: "Ticket updated successfully" });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ error: "Failed to update ticket" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Ticket viewer app is running at http://localhost:${PORT}`);
});