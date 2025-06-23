// Enhanced ticketRoutes.js with JS Doc and Swagger annotations
import express from 'express';
import { loadTickets, saveTickets, querry } from "../utils/database.js";
import { bus } from '../utils/Commbus.js';

const router = express.Router();

/**
 * @typedef Ticket
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} [replies]
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [tickets]
 *     responses:
 *       200:
 *         description: List of all tickets
 */
// @ts-ignore
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await loadTickets();
        console.log(tickets);
        res.json(tickets);
    } catch (err) {
        console.error('Failed to get tickets:', err.message);
    }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket found
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
 *     summary: Update a ticket
 *     tags: [tickets]
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
 *     responses:
 *       200:
 *         description: Ticket updated
 *       404:
 *         description: Ticket not found
 */
// @ts-ignore
router.put('/tickets/:id', async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        const updatedData = req.body;

        const tickets = bus.request('getTickets', {});
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);

        if (ticketIndex === -1) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        tickets[ticketIndex] = { ...tickets[ticketIndex], ...updatedData };
        bus.emit('saveTickets', tickets);

        res.status(200).json({ message: "Ticket updated successfully" });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ error: "Failed to update ticket" });
    }
});

/**
 * @swagger
 * /api/tickets/{id}/delete:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket deleted
 *       404:
 *         description: Ticket not found
 */
// @ts-ignore
router.delete('/tickets/:id/delete', async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        let data = { quarry: 'DELETE FROM tickets WHERE id = ?',params:[ticketId]}
        const result = await querry(data);
        if (result) {
            res.status(200).json({ message: "Ticket deleted successfully" });
        } else {
            res.status(500).json({ error: "Failed to delete ticket" });
        }
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ error: "Failed to delete ticket" });
    }
});

/**
 * @swagger
 * /api/tickets/{id}/close:
 *   post:
 *     summary: Close a ticket
 *     tags: [tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket closed
 *       404:
 *         description: Ticket not found
 */
// @ts-ignore
router.post('/tickets/:id/close', async (req, res) => {
    try {
        const ticketId = parseInt(req.params.id);
        const result = await querry('UPDATE tickets SET status = ? WHERE id = ?', ["0", ticketId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        res.status(200).json({ message: "Ticket closed successfully" });
    } catch (error) {
        console.error("Error closing ticket:", error);
        res.status(500).json({ error: "Failed to close ticket" });
    }
});

/**
 * @swagger
 * /api/tickets/{id}/reply:
 *   post:
 *     summary: Add a reply to a ticket
 *     tags: [tickets]
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
 *             required: [reply]
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added
 *       404:
 *         description: Ticket not found
 */
// @ts-ignore
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
        if (!ticket.replies) {
            ticket.replies = [];
        }
        ticket.replies.push(reply);
        saveTickets(tickets);
        bus.emit('sendmsg', { channelId: ticket.channelId, msg: reply });

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
 *     summary: Get total ticket count
 *     tags: [tickets]
 *     responses:
 *       200:
 *         description: Total number of tickets
 */
// @ts-ignore
router.get('/tickets/count', async (req, res) => {
    try {
        const tickets = await bus.request('getTickets', {});
        res.json({ count: tickets.length });
    } catch (error) {
        console.error("Error getting ticket count:", error);
        res.status(500).json({ error: "Failed to get ticket count" });
    }
});

export default router;
