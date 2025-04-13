// src/routes/ticketRoutes.js

import express from 'express';
import { loadTickets, saveTickets } from "../src/modules/database.js";

const router = express.Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     description: Get all tickets
 *     responses:
 *       200:
 *         description: Successfully retrieved tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *               example:
 *                 - id: 1
 *                   title: "Issue with login"
 *                   description: "User unable to log in to the system."
 *                 - id: 2
 *                   title: "Error on payment page"
 *                   description: "Payment gateway shows error."
 */
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await loadTickets();
        res.json(tickets);
    } catch (error) {
        console.error("Error loading tickets:", error);
        res.status(500).json({ error: "Failed to load tickets" });
    }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     description: Get a specific ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *               example:
 *                 id: 1
 *                 title: "Issue with login"
 *                 description: "User unable to log in to the system."
 *       404:
 *         description: Ticket not found
 */
router.get('/tickets/:id', async (req, res) => {
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

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     description: Update a specific ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               title: "Updated Issue with login"
 *               description: "User still unable to log in after password reset."
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
 */
router.put('/tickets/:id', async (req, res) => {
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

export default router;
