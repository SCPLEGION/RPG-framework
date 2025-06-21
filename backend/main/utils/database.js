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
            closingReason TEXT,
            messages TEXT
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
            channelId TEXT UNIQUE,
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
        keepAliveInitialDelay: 10000,
        connectTimeout: 10000,
        connectionLimit: 2
    });

    console.debug('[Database] MySQL connection established');

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
        await mysqlConn?.ping();
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

        const usersSet = new Set();
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
            if (Array.isArray(ticket.messages)) {
                ticket.messages.forEach(msg => {
                    if (msg.authorId) usersSet.add(msg.authorId);
                });
            }
            const usersJson = JSON.stringify(Array.from(usersSet));
            usersSet.clear();

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
                    usersJson,
                    JSON.stringify(ticket.messages || []),
                    ticket.status
                );
                console.debug(`[saveTickets] Ticket saved/updated: channelId=${ticket.channelId}, id=${ticket.id}`);
            } catch (err) {
                console.error(`[saveTickets] Error saving ticket: channelId=${ticket.channelId}, id=${ticket.id}`, err);
            }
        }
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping();
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
                    ticket.type || '',
                    ticket.userId || '',
                    ticket.userTag || '',
                    ticket.ticketNumber || 0,
                    ticket.channelId || '',
                    ticket.createdAt || '',
                    ticket.claimedBy || null,
                    ticket.closedBy || null,
                    ticket.closingReason || '',
                    ticket.users || '[]',
                    JSON.stringify(ticket.messages || []),
                    ticket.status ?? 2
                ]);
                console.debug(`[saveTickets] Ticket saved/updated: channelId=${ticket.channelId}, id=${ticket.id}`);
            } catch (err) {
                console.error(`[saveTickets] Error saving ticket: channelId=${ticket.channelId}, id=${ticket.id}`, err);
            }
        }
    } else {
        console.warn('[saveTickets] Unknown storage type:', config.storage);
    }
};

export const updateTicketStatus = async (ticketId) => {
    if (config.storage === "sqlite") {
        const ticket = db.prepare("SELECT * FROM tickets WHERE id = ?").get(ticketId);
        if (ticket) {
            let status = ticket.closedBy !== null ? 0 : ticket.claimedBy !== null ? 1 : 2;
            db.prepare("UPDATE tickets SET status = ? WHERE id = ?").run(status, ticketId);
        }
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping();
        const [ticket] = await mysqlConn.execute("SELECT * FROM tickets WHERE id = ?", [ticketId]);
        if (ticket.length > 0) {
            let status = ticket[0].closedBy !== null ? 0 : ticket[0].claimedBy !== null ? 1 : 2;
            await mysqlConn.execute("UPDATE tickets SET status = ? WHERE id = ?", [status, ticketId]);
        }
    }
};

export const claimTicket = async (ticketId, userId) => {
    if (config.storage === "sqlite") {
        db.prepare("UPDATE tickets SET claimedBy = ? WHERE id = ?").run(userId, ticketId);
        await updateTicketStatus(ticketId);
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping();
        await mysqlConn.execute("UPDATE tickets SET claimedBy = ? WHERE id = ?", [userId, ticketId]);
        await updateTicketStatus(ticketId);
    }
};

export const closeTicket = async (ticketId, userId, reason) => {
    if (config.storage === "sqlite") {
        db.prepare("UPDATE tickets SET closedBy = ?, closingReason = ? WHERE id = ?").run(userId, reason, ticketId);
        await updateTicketStatus(ticketId);
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping();
        await mysqlConn.execute("UPDATE tickets SET closedBy = ?, closingReason = ? WHERE id = ?", [userId, reason, ticketId]);
        await updateTicketStatus(ticketId);
    }
};

const queryQueue = [];
let isProcessingQueue = false;

async function processQueryQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (queryQueue.length > 0) {
        const { query, params, resolve, reject } = queryQueue.shift();
        try {
            const result = await _querry(query, params);
            resolve(result);
        } catch (err) {
            console.error('[processQueryQueue] Query error:', err);
            reject(err);
        }
    }

    isProcessingQueue = false;
}

const _querry = async (query, params = []) => {
    if (config.storage === "mysql") {
        try {
            if (!mysqlConn || mysqlConn.connection._closing) {
                throw new Error("No active MySQL connection.");
            }

            await mysqlConn.ping();
            const [result] = await mysqlConn.execute(query, params);
            return result;
        } catch (err) {
            console.warn('[querry] MySQL connection failed, retrying...', err.message);
            try {
                mysqlConn = await mysql.createConnection({
                    host: config.mysql.host,
                    user: config.mysql.user,
                    password: config.mysql.password,
                    database: config.mysql.database,
                    enableKeepAlive: true
                });
                const [result] = await mysqlConn.execute(query, params);
                return result;
            } catch (reErr) {
                console.error('[querry] MySQL re-connection also failed:', reErr.message);
                throw reErr;
            }
        }
    } else if (config.storage === "sqlite") {
        return db.prepare(query).run(...params);
    } else {
        throw new Error("Unsupported storage type.");
    }
};



export const querry = (query, params) => {
    return new Promise((resolve, reject) => {
        queryQueue.push({ query, params, resolve, reject });
        processQueryQueue();
    });
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
