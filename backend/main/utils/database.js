/**
 * @module Database
 */

import fs from "fs/promises";
import Database from "better-sqlite3";
import { bus } from "./Commbus.js";
import mysql from "mysql2/promise";

// @ts-ignore
const configJson = await fs.readFile(new URL("../config.json", import.meta.url), "utf8");
const config = JSON.parse(configJson);

export let db;
export let mysqlConn;

// Initialize database if configured
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
            users TEXT,
            closingReason TEXT, -- New column for closing reason
            messages TEXT -- New column to store ticket messages as JSON
        );
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT,
            displayName TEXT,
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
            users TEXT,
            closingReason TEXT,
            messages TEXT
        );
    `);

    db.exec(`
        INSERT OR IGNORE INTO tickets_new (id, type, userId, userTag, ticketNumber, status, channelId, createdAt, claimedBy, closedBy, closingReason, users, messages)
        SELECT id, type, userId, userTag, ticketNumber, status, channelId, createdAt, claimedBy, closedBy, closingReason, users, messages
        FROM tickets
        WHERE id IS NOT NULL;
    `);

    db.exec(`DROP TABLE tickets;`);
    db.exec(`ALTER TABLE tickets_new RENAME TO tickets;`);
} else if (config.storage === "mysql") {
    mysqlConn = await mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000 // 10 seconds
    })
    console.debug('[Database] MySQL connection established');

    // Create tables if not exist
    await mysqlConn.execute(`
        CREATE TABLE IF NOT EXISTS tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(255),
            userId VARCHAR(255),
            userTag VARCHAR(255),
            ticketNumber INT,
            status INT,
            channelId VARCHAR(255) UNIQUE,
            createdAt VARCHAR(255),
            claimedBy VARCHAR(255),
            closedBy VARCHAR(255),
            users TEXT,
            closingReason TEXT,
            messages TEXT
        )
    `);

    await mysqlConn.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            username VARCHAR(255),
            displayName VARCHAR(255),
            discriminator VARCHAR(255),
            role VARCHAR(255),
            token VARCHAR(255)
        )
    `);
}

/**
 * Loads tickets from the database or JSON file based on the storage configuration.
 * @returns {Promise<Array<Object>>} An array of ticket objects.
 */

export const loadTickets = async () => {
    if (config.storage === "json") {
        try {
            const data = await fs.readFile('./tickets.json', 'utf8');
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
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping(); // Ensure MySQL connection is alive
        const [rows] = await mysqlConn.execute("SELECT * FROM tickets");
        for (const row of rows) {
            await updateTicketStatus(row.id);
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
export const saveTickets = async (tickets) => {
    console.debug('[saveTickets] Called with', tickets.length, 'tickets');
    if (config.storage === "json") {
        try {
            console.debug('[saveTickets] Using JSON storage');
            await fs.writeFile('./tickets.json', JSON.stringify(tickets, null, 2));
            console.debug('[saveTickets] Tickets saved to tickets.json');
        } catch (error) {
            console.error('[saveTickets] Error saving tickets (JSON):', error);
        }
    } else if (config.storage === "sqlite") {
        console.debug('[saveTickets] Using SQLite storage');
        // Your existing SQLite logic here (can stay sync since better-sqlite3 is sync)
        // but wrap in Promise.resolve for consistency:
        return Promise.resolve(() => {
            const usersSet = new Set();
            for (const ticket of tickets) {
                if (Array.isArray(ticket.messages)) {
                    ticket.messages.forEach(msg => {
                        if (msg.authorId) usersSet.add(msg.authorId);
                    });
                }
                ticket.users = JSON.stringify(Array.from(usersSet));
                usersSet.clear();
            }

            const insertOrUpdateStmt = db.prepare(`
                INSERT INTO tickets (id, type, userId, userTag, ticketNumber, channelId, createdAt, claimedBy, closedBy, closingReason, users, messages, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(channelId) DO UPDATE SET
                    type = excluded.type,
                    userId = excluded.userId,
                    userTag = excluded.userTag,
                    ticketNumber = excluded.ticketNumber,
                    createdAt = excluded.createdAt,
                    claimedBy = excluded.claimedBy,
                    closedBy = excluded.closedBy,
                    closingReason = excluded.closingReason,
                    users = excluded.users,
                    messages = excluded.messages,
                    status = excluded.status
            `);

            for (const ticket of tickets) {
                try {
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
                        ticket.users,
                        JSON.stringify(ticket.messages || []),
                        ticket.status
                    );
                    console.debug(`[saveTickets] Ticket saved/updated: channelId=${ticket.channelId}, id=${ticket.id}`);
                } catch (err) {
                    console.error(`[saveTickets] Error saving ticket: channelId=${ticket.channelId}, id=${ticket.id}`, err);
                }
            }
            console.debug('[saveTickets] All tickets processed for SQLite');
        });
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping(); // Ensure MySQL connection is alive
        console.debug('[saveTickets] Using MySQL storage');
        const insertOrUpdateStmt = `
            INSERT INTO tickets (id, type, userId, userTag, ticketNumber, channelId, createdAt, claimedBy, closedBy, closingReason, users, messages, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                type = VALUES(type),
                userId = VALUES(userId),
                userTag = VALUES(userTag),
                ticketNumber = VALUES(ticketNumber),
                createdAt = VALUES(createdAt),
                claimedBy = VALUES(claimedBy),
                closedBy = VALUES(closedBy),
                closingReason = VALUES(closingReason),
                users = VALUES(users),
                messages = VALUES(messages),
                status = VALUES(status)
        `;

        for (const ticket of tickets) {
            try {
                await mysqlConn.execute(insertOrUpdateStmt, [
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
                    ticket.users,
                    JSON.stringify(ticket.messages || []),
                    ticket.status
                ]);
                console.debug(`[saveTickets] Ticket saved/updated: channelId=${ticket.channelId}, id=${ticket.id}`);
            } catch (err) {
                console.error(`[saveTickets] Error saving ticket: channelId=${ticket.channelId}, id=${ticket.id}`, err);
            }
        }
        console.debug('[saveTickets] All tickets processed for MySQL');
    } else {
        console.warn('[saveTickets] Unknown storage type:', config.storage);
    }
};


/**
 * Updates the status of a ticket based on its current state.
 * @param {number} ticketId - The ID of the ticket to update.
 */
export const updateTicketStatus = async (ticketId) => {
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
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping(); // Ensure MySQL connection is alive
        const [ticket] = await mysqlConn.execute("SELECT * FROM tickets WHERE id = ?", [ticketId]);
        
        if (ticket.length > 0) {
            let status;

            if (ticket[0].closedBy !== null) {
                status = 0; // closed
            } else if (ticket[0].claimedBy !== null) {
                status = 1; // claimed
            } else {
                status = 2; // unclaimed
            }

            await mysqlConn.execute("UPDATE tickets SET status = ? WHERE id = ?", [status, ticketId]);
        }
    }
};

/**
 * Claims a ticket by assigning it to a user.
 * @param {number} ticketId - The ID of the ticket to claim.
 * @param {string} userId - The ID of the user claiming the ticket.
 */
export const claimTicket = async (ticketId, userId) => {
    if (config.storage === "sqlite") {
        db.prepare("UPDATE tickets SET claimedBy = ? WHERE id = ?").run(userId, ticketId);
        await updateTicketStatus(ticketId);
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping(); // Ensure MySQL connection is alive
        await mysqlConn.execute("UPDATE tickets SET claimedBy = ? WHERE id = ?", [userId, ticketId]);
        await updateTicketStatus(ticketId);
    }
};

/**
 * Closes a ticket with a specified reason.
 * @param {number} ticketId - The ID of the ticket to close.
 * @param {string} userId - The ID of the user closing the ticket.
 * @param {string} reason - The reason for closing the ticket.
 */
export const closeTicket = async (ticketId, userId, reason) => {
    if (config.storage === "sqlite") {
        db.prepare("UPDATE tickets SET closedBy = ?, closingReason = ? WHERE id = ?").run(userId, reason, ticketId);
        await updateTicketStatus(ticketId);
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping(); // Ensure MySQL connection is alive
        await mysqlConn.execute("UPDATE tickets SET closedBy = ?, closingReason = ? WHERE id = ?", [userId, reason, ticketId]);
        await updateTicketStatus(ticketId);
    }
};

/**
 * Executes a custom SQL query on the database.
 * @param {string} query - The SQL query to execute.
 * @param {Array<any>} params - The parameters for the SQL query.
 * @returns {Object} The result of the query execution.
 * @throws {Error} If the storage type is not supported.
 */
export const querry = async (query, params) => {
    if (config.storage === "sqlite") {
        return db.prepare(query).run(params);
    } else if (config.storage === "mysql") {
        try {
            await mysqlConn?.ping();
        } catch (err) {
            // Jeœli po³¹czenie pad³o, spróbuj po³¹czyæ siê ponownie
            console.warn('[querry] MySQL connection lost. Reconnecting...');
            mysqlConn = await mysql.createConnection({
                host: config.mysql.host,
                user: config.mysql.user,
                password: config.mysql.password,
                database: config.mysql.database,
            });
            await mysqlConn.ping();
        }
        const [result] = await mysqlConn.execute(query, params);
        return result;
    } else {
        throw new Error("Database storage type not supported for this operation.");
    }
};

bus.on('querry', async (data) => {
    const { id, query, params } = data;

    try {
        const result = await querry(query, params);
        bus.emit('query:result', { id, result });
    } catch (error) {
        console.error("Error executing query:", error);
        bus.emit('query:error', { id, error: error.message });
    }
});

bus.on('getTickets', async (data) => {
  try {
    const tickets = await loadTickets();
    bus.emit(`getTickets:response:${data.id}`, tickets);
  } catch (err) {
    bus.emit(`getTickets:error:${data.id}`, { message: err.message });
  }
});


bus.on('saveTickets', async (tickets) => {
    try {
        await saveTickets(tickets);
        bus.emit('ticketsSaved');
    } catch (error) {
        console.error("Error saving tickets:", error);
        bus.emit('saveTicketsError', error);
    }
});
