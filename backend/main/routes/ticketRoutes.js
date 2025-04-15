// src/routes/ticketRoutes.js

import express from 'express';
import { loadTickets, saveTickets } from "../src/modules/database.js";
import { sendmsg } from '../src/bot.js';

const router = express.Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     tags:
 *     - tickets
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
 * /api/tickets:
 *   post:
 *     tags:
 *     - tickets
 *     description: Create a new ticket
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
 *               title: "Login issue after password reset"
 *               description: "User cannot log in after resetting their password."
 *     responses:
 *       201:
 *         description: Successfully created a ticket
 *       400:
 *         description: Invalid request body
 */
router.post('/tickets', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const tickets = await loadTickets();
        const newTicket = {
            id: tickets.length + 1, // Just an example, you may want to use a better ID strategy
            title,
            description,
        };

        tickets.push(newTicket);
        await saveTickets(tickets);

        res.status(201).json(newTicket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ error: "Failed to create ticket" });
    }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     tags:
 *     - tickets
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
 *     tags:
 *     - tickets
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

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     tags:
 *     - tickets
 *     description: Delete a specific ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted the ticket
 *       404:
 *         description: Ticket not found
 */
router.delete('/tickets/:id', async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);

        const tickets = await loadTickets();
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);

        if (ticketIndex === -1) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        // Remove the ticket
        tickets.splice(ticketIndex, 1);
        await saveTickets(tickets);

        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ error: "Failed to delete ticket" });
    }
});

/**
 * @swagger
 * /api/tickets/{id}/reply:
 *   post:
 *     tags:
 *     - tickets
 *     description: Reply to a specific ticket by ID
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
 *               reply:
 *                 type: string
 *             example:
 *               reply: "We are looking into your issue and will update you soon."
 *     responses:
 *       200:
 *         description: Successfully added the reply to the ticket
 *       404:
 *         description: Ticket not found
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post('/tickets/:id/reply', async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).json({ error: "Reply content is required" });
        }

        const tickets = await loadTickets();
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        // Assuming ticket.replies is an array that stores replies
        if (!ticket.replies) {
            ticket.replies = [];
        }
        ticket.replies.push(reply);
        await saveTickets(tickets);
        // Here you can also send the reply to a Discord channel if needed
        sendmsg(ticket.channelId, reply);

        res.status(200).json({ message: "Reply added successfully" });
    } catch (error) {
        console.error("Error replying to ticket:", error);
        res.status(500).json({ error: "Failed to add reply to ticket" });
    }
});



/**
 * @swagger
 * /api/tickets/count:
 *   get:
 *     tags:
 *     - tickets
 *     description: Get the total count of tickets
 *     responses:
 *       200:
 *         description: Successfully retrieved ticket count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *               example:
 *                 count: 42
 */
router.get('/tickets/count', async (req, res) => {
    try {
        const tickets = await loadTickets();
        res.json({ count: tickets.length });
    } catch (error) {
        console.error("Error getting ticket count:", error);
        res.status(500).json({ error: "Failed to get ticket count" });
    }
});


export default router;
