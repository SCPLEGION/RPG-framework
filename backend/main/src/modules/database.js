/**
 * @module Database
 */

import fs from "fs";
import Database from "better-sqlite3";

// @ts-ignore
const config = JSON.parse(fs.readFileSync(new URL("../../config.json", import.meta.url), "utf8"));

export let db;

// Initialize SQLite database if configured
if (config.storage === "sqlite") {
    db = new Database('./tickets.db');

    db.exec(`
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
            role TEXT,
            token TEXT
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS tickets_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            type TEXT,
            userId TEXT,
            userTag TEXT,
            ticketNumber INTEGER,
            status INTEGER,
            channelId TEXT UNIQUE, -- Add UNIQUE constraint here
            createdAt TEXT,
            claimedBy TEXT,
            closedBy TEXT,
            closingReason TEXT,
            messages TEXT
        );
    `);

    db.exec(`
        INSERT OR IGNORE INTO tickets_new (id, type, userId, userTag, ticketNumber, status, channelId, createdAt, claimedBy, closedBy, closingReason, messages)
        SELECT id, type, userId, userTag, ticketNumber, status, channelId, createdAt, claimedBy, closedBy, closingReason, messages
        FROM tickets
        WHERE id IS NOT NULL;
    `);

    db.exec(`DROP TABLE tickets;`);
    db.exec(`ALTER TABLE tickets_new RENAME TO tickets;`);
}

/**
 * Loads tickets from the database or JSON file based on the storage configuration.
 * @returns {Array<Object>} An array of ticket objects.
 */
export const loadTickets = () => {
    if (config.storage === "json") {
        try {
            const data = fs.readFileSync('./tickets.json', 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading tickets:', error);
            return [];
        }
    } else if (config.storage === "sqlite") {
        const rows = db.prepare("SELECT * FROM tickets").all();
        for (const row of rows) {
            updateTicketStatus(row.id);
        }
        return rows.map(row => ({
            ...row,
            messages: JSON.parse(row.messages || "[]"),
            closingReason: row.closingReason || null
        }));
    }
};

/**
 * Saves tickets to the database or JSON file based on the storage configuration.
 * @param {Array<Object>} tickets - An array of ticket objects to save.
 */
export const saveTickets = (tickets) => {
    if (config.storage === "json") {
        try {
            fs.writeFileSync('./tickets.json', JSON.stringify(tickets, null, 2));
        } catch (error) {
            console.error('Error saving tickets:', error);
        }
    } else if (config.storage === "sqlite") {
        const insertOrUpdateStmt = db.prepare(`
            INSERT INTO tickets (id, type, userId, userTag, ticketNumber, channelId, createdAt, claimedBy, closedBy, closingReason, messages, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(channelId) DO UPDATE SET
                type = excluded.type,
                userId = excluded.userId,
                userTag = excluded.userTag,
                ticketNumber = excluded.ticketNumber,
                createdAt = excluded.createdAt,
                claimedBy = excluded.claimedBy,
                closedBy = excluded.closedBy,
                closingReason = excluded.closingReason,
                messages = excluded.messages,
                status = excluded.status
        `);

        for (const ticket of tickets) {
            insertOrUpdateStmt.run(
                ticket.id || null,
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
            );
        }
    }
};

/**
 * Updates the status of a ticket based on its current state.
 * @param {number} ticketId - The ID of the ticket to update.
 */
export const updateTicketStatus = (ticketId) => {
    if (config.storage === "sqlite") {
        const ticket = db.prepare("SELECT * FROM tickets WHERE id = ?").get(ticketId);
        
        if (ticket) {
            let status;

            if (ticket.closedBy !== null) {
                status = 0; // closed
            } else if (ticket.claimedBy !== null) {
                status = 1; // claimed
            } else {
                status = 2; // unclaimed
            }

            db.prepare("UPDATE tickets SET status = ? WHERE id = ?").run(status, ticketId);
        }
    }
};

/**
 * Claims a ticket by assigning it to a user.
 * @param {number} ticketId - The ID of the ticket to claim.
 * @param {string} userId - The ID of the user claiming the ticket.
 */
export const claimTicket = (ticketId, userId) => {
    if (config.storage === "sqlite") {
        db.prepare("UPDATE tickets SET claimedBy = ? WHERE id = ?").run(userId, ticketId);
        updateTicketStatus(ticketId);
    }
};

/**
 * Closes a ticket with a specified reason.
 * @param {number} ticketId - The ID of the ticket to close.
 * @param {string} userId - The ID of the user closing the ticket.
 * @param {string} reason - The reason for closing the ticket.
 */
export const closeTicket = (ticketId, userId, reason) => {
    if (config.storage === "sqlite") {
        db.prepare("UPDATE tickets SET closedBy = ?, closingReason = ? WHERE id = ?").run(userId, reason, ticketId);
        updateTicketStatus(ticketId);
    }
};

/**
 * Executes a custom SQL query on the database.
 * @param {string} query - The SQL query to execute.
 * @param {Array<any>} params - The parameters for the SQL query.
 * @returns {Object} The result of the query execution.
 * @throws {Error} If the storage type is not supported.
 */
export const querry = (query, params) => {
    if (config.storage === "sqlite") {
        return db.prepare(query).run(params);
    } else {
        throw new Error("Database storage type not supported for this operation.");
    }
};
