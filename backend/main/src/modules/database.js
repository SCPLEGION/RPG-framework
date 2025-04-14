import fs from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const config = JSON.parse(fs.readFileSync(new URL("../../config.json", import.meta.url), "utf8"));

export let db;

// Initialize SQLite database if configured
if (config.storage === "sqlite") {
    (async () => {
        db = await open({
            filename: './tickets.db',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                userId TEXT,
                userTag TEXT,
                ticketNumber INTEGER,
                status INTEGER,
                channelId TEXT,
                createdAt TEXT,
                claimedBy TEXT,
                closedBy TEXT,
                closingReason TEXT, -- New column for closing reason
                messages TEXT -- New column to store ticket messages as JSON
            );
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT,
                discriminator TEXT,
                role TEXT
            )
        `);
    })();
}

export const loadTickets = async () => {
    if (config.storage === "json") {
        try {
            const data = fs.readFileSync('./tickets.json', 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading tickets:', error);
            return [];
        }
    } else if (config.storage === "sqlite") {
        const rows = await db.all("SELECT * FROM tickets");
        for (const row of rows) {
            updateTicketStatus(row.id);
        }
        return rows.map(row => ({
            ...row,
            messages: JSON.parse(row.messages || "[]"),
            closingReason: row.closingReason || null // Include closing reason
        }));
    }
};

export const saveTickets = async (tickets) => {
    if (config.storage === "json") {
        try {
            fs.writeFileSync('./tickets.json', JSON.stringify(tickets, null, 2));
        } catch (error) {
            console.error('Error saving tickets:', error);
        }
    } else if (config.storage === "sqlite") {
        const insertOrUpdateStmt = `
            INSERT INTO tickets (id, type, userId, userTag, ticketNumber, channelId, createdAt, claimedBy, closedBy, closingReason, messages, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                type = excluded.type,
                userId = excluded.userId,
                userTag = excluded.userTag,
                ticketNumber = excluded.ticketNumber,
                channelId = excluded.channelId,
                createdAt = excluded.createdAt,
                claimedBy = excluded.claimedBy,
                closedBy = excluded.closedBy,
                closingReason = excluded.closingReason,
                messages = excluded.messages,
                status = excluded.status
        `;

        for (const ticket of tickets) {
            await db.run(insertOrUpdateStmt, [
                ticket.id || null, // Use the ticket ID if it exists, otherwise null for auto-increment
                ticket.type,
                ticket.userId,
                ticket.userTag,
                ticket.ticketNumber,
                ticket.channelId,
                ticket.createdAt,
                ticket.claimedBy,
                ticket.closedBy,
                ticket.closingReason,
                JSON.stringify(ticket.messages || []),
                ticket.status
            ]);
        }
    }
};

// Function to update the status of a ticket based on the hierarchy
export const updateTicketStatus = async (ticketId) => {
    if (config.storage === "sqlite") {
        const ticket = await db.get("SELECT * FROM tickets WHERE id = ?", [ticketId]);
        
        if (ticket) {
            let status;

            // Check if the ticket is closed
            if (ticket.closedBy !== null) {
                status = 0; // closed
            } else if (ticket.claimedBy !== null) {
                status = 1; // claimed
            } else {
                status = 2; // unclaimed
            }

            // Update the status in the database
            await db.run("UPDATE tickets SET status = ? WHERE id = ?", [status, ticketId]);
        }
    }
};

// Function to claim a ticket
export const claimTicket = async (ticketId, userId) => {
    if (config.storage === "sqlite") {
        await db.run("UPDATE tickets SET claimedBy = ? WHERE id = ?", [userId, ticketId]);
        await updateTicketStatus(ticketId); // Update status after claiming
    }
};

// Function to close a ticket
export const closeTicket = async (ticketId, userId, reason) => {
    if (config.storage === "sqlite") {
        await db.run("UPDATE tickets SET closedBy = ?, closingReason = ? WHERE id = ?", [userId, reason, ticketId]);
        await updateTicketStatus(ticketId); // Update status after closing
    }
};
