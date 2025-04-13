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
                channelId TEXT,
                createdAt TEXT,
                claimedBy TEXT,
                closedBy TEXT,
                closingReason TEXT, -- New column for closing reason
                messages TEXT -- New column to store ticket messages as JSON
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
        await db.exec("DELETE FROM tickets");
        const insertStmt = `
            INSERT INTO tickets (type, userId, userTag, ticketNumber, channelId, createdAt, claimedBy, closedBy, closingReason, messages)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        for (const ticket of tickets) {
            await db.run(insertStmt, [
                ticket.type,
                ticket.userId,
                ticket.userTag,
                ticket.ticketNumber,
                ticket.channelId,
                ticket.createdAt,
                ticket.claimedBy,
                ticket.closedBy,
                ticket.closingReason, // New column for closing reason
                JSON.stringify(ticket.messages || []) // Save messages as JSON
            ]);
        }
    }
};