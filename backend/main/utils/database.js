/**
 * @module Database
 */

import fs from "fs/promises";
import Database from "better-sqlite3";
import { bus } from "./Commbus.js";
import mysql from "mysql2/promise";

import config from '../config.js';

export let db;
export let mysqlConn;

if (config.storage === "sqlite") {
    db = new Database("./tickets.db")

    db.exec(`
       CREATE TABLE IF NOT EXISTS [tickets] (
     [id] INTEGER PRIMARY KEY AUTOINCREMENT
   , [type] text NULL
   , [userId] text NULL
   , [userTag] text NULL
   , [ticketNumber] int NULL
   , [status] int NULL
   , [channelId] text NULL UNIQUE
   , [createdAt] text NULL
   , [claimedBy] text NULL
   , [closedBy] text NULL
   , [users] text NULL
   , [closingReason] text NULL
   , [messages] text NULL
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
    CREATE TABLE IF NOT EXISTS tickets_new AS SELECT * FROM tickets;
    DROP TABLE tickets;
    ALTER TABLE tickets_new RENAME TO tickets;
  `);

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

    console.debug("[Database] MySQL connection established");

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
    );
  `);

    await mysqlConn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255),
      displayName VARCHAR(255),
      discriminator VARCHAR(255),
      role VARCHAR(255),
      token VARCHAR(255)
    );
  `);
}

export const loadTickets = async () => {
    try {
        if (config.storage === "json") {
            const data = await fs.readFile("./tickets.json", "utf8");
            return JSON.parse(data);
        }

        const query = "SELECT * FROM tickets";
        let rows = [];

        if (config.storage === "sqlite") {
            rows = db.prepare(query).all();
        } else if (config.storage === "mysql") {
            await mysqlConn?.ping();
            const [results] = await mysqlConn.execute(query);
            rows = results;
        }

        for (const row of rows) {
            await updateTicketStatus(row.id);
        }

        return rows.map((row) => ({
            ...row,
            messages: JSON.parse(row.messages || "[]"),
            closingReason: row.closingReason || null
        }));

    } catch (err) {
        console.error("[loadTickets] Error:", err);
        return [];
    }
};

export const saveTickets = async (tickets) => {
    console.debug("[saveTickets] Saving", tickets.length, "tickets");

    if (config.storage === "json") {
        await fs.writeFile("./tickets.json", JSON.stringify(tickets, null, 2));
        return;
    }

    const insertSQL = config.storage === "sqlite"
        ? `
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
  `
        : `
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
        const users = (ticket.messages || []).map(m => m.authorId).filter(Boolean);
        const usersJson = JSON.stringify([...new Set(users)]);
        const params = [
            ticket.id || null,
            ticket.type,
            ticket.userId,
            ticket.userTag,
            ticket.ticketNumber,
            ticket.channelId,
            ticket.createdAt,
            ticket.claimedBy,
            ticket.closedBy,
            ticket.closingReason || '',
            usersJson,
            JSON.stringify(ticket.messages || []),
            ticket.status ?? 2
        ];

        try {
            config.storage === "sqlite"
                ? db.prepare(insertSQL).run(...params)
                : await mysqlConn.execute(insertSQL, params);
        } catch (err) {
            console.error(`[saveTickets] Failed to save ticket: ${ticket.channelId}`, err);
        }
    }
};

export const updateTicketStatus = async (ticketId) => {
    const query = "SELECT * FROM tickets WHERE id = ?";
    const update = "UPDATE tickets SET status = ? WHERE id = ?";

    if (config.storage === "sqlite") {
        const ticket = db.prepare(query).get(ticketId);
        const status = ticket?.closedBy ? 0 : ticket?.claimedBy ? 1 : 2;
        db.prepare(update).run(status, ticketId);
    } else if (config.storage === "mysql") {
        await mysqlConn?.ping();
        const [results] = await mysqlConn.execute(query, [ticketId]);
        const ticket = results[0];
        if (ticket) {
            const status = ticket.closedBy ? 0 : ticket.claimedBy ? 1 : 2;
            await mysqlConn.execute(update, [status, ticketId]);
        }
    }
};

export const claimTicket = async (ticketId, userId) => {
    const update = "UPDATE tickets SET claimedBy = ? WHERE id = ?";
    config.storage === "sqlite"
        ? db.prepare(update).run(userId, ticketId)
        : await mysqlConn.execute(update, [userId, ticketId]);
    await updateTicketStatus(ticketId);
};

export const closeTicket = async (ticketId, userId, reason) => {
    const update = "UPDATE tickets SET closedBy = ?, closingReason = ? WHERE id = ?";
    config.storage === "sqlite"
        ? db.prepare(update).run(userId, reason, ticketId)
        : await mysqlConn.execute(update, [userId, reason, ticketId]);
    await updateTicketStatus(ticketId);
};

/**
 * Manages support tickets by providing methods to interact with different storage backends.
 */
export class TicketManager {
    /**
     * Closes a ticket with the given ID, user, and reason.
     * @param {string} id - The ID of the ticket to close.
     * @param {string} userId - The ID of the user closing the ticket.
     * @param {string} reason - The reason for closing the ticket.
     * @returns {Promise<void>}
     */
    static async close(id, userId, reason) {
        await closeTicket(id, userId, reason);
    }

    /**
     * Deletes a ticket by ID from the current storage (sqlite, mysql, or file-based).
     * @param {string} id - The ID of the ticket to delete.
     * @returns {Promise<void>}
     */
    static async delete(id) {
        if (config.storage === "sqlite") {
            db.prepare("DELETE FROM tickets WHERE id = ?").run(id);
        } else if (config.storage === "mysql") {
            await mysqlConn.execute("DELETE FROM tickets WHERE id = ?", [id]);
        } else {
            const all = await loadTickets();
            await saveTickets(all.filter(t => t.id !== id));
        }
    }

    /**
     * Marks a ticket as claimed by a specific user.
     * @param {string} id - The ID of the ticket to claim.
     * @param {string} userId - The ID of the user claiming the ticket.
     * @returns {Promise<void>}
     */
    static async claim(id, userId) {
        await claimTicket(id, userId);
    }

    /**
     * Retrieves a ticket by its ID from the current storage.
     * @param {string} id - The ID of the ticket to retrieve.
     * @returns {Promise<Object|null>} The ticket object, or null if not found.
     */
    static async get(id) {
        const query = "SELECT * FROM tickets WHERE id = ?";
        if (config.storage === "sqlite") return db.prepare(query).get(id);
        if (config.storage === "mysql") {
            const [rows] = await mysqlConn.execute(query, [id]);
            return rows[0] || null;
        }
        const all = await loadTickets();
        return all.find(t => t.id === id) || null;
    }

    /**
     * Sends a reply message to a specific ticket.
     * @param {string} id - The ID of the ticket to reply to.
     * @param {string} message - The reply message content.
     * @returns {Promise<void>}
     */
    static async reply(id, message) {
        bus.emit("replyTicket", { id, message });
    }

    /**
     * Lists all tickets from the current storage.
     * @returns {Promise<Object[]>} An array of ticket objects.
     */
    static async list() {
        return await loadTickets();
    }
}


const queryQueue = [];
let isProcessingQueue = false;

async function processQueryQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (queryQueue.length > 0) {
        const { query, params, resolve, reject } = queryQueue.shift();
        try {
            const result = await _query(query, params);
            resolve(result);
        } catch (err) {
            console.error("[processQueryQueue] Query error:", err);
            reject(err);
        }
    }

    isProcessingQueue = false;
}

const _query = async (query, params = []) => {
    try {
        if (config.storage === "mysql") {
            await mysqlConn?.ping();
            const [result] = await mysqlConn.execute(query, params);
            return result;
        } else if (config.storage === "sqlite") {
            return db.prepare(query).run(...params);
        }
        throw new Error("Unsupported storage type.");
    } catch (err) {
        if (config.storage === "mysql") {
            console.warn("[_query] MySQL retry due to:", err.message);
            mysqlConn = await mysql.createConnection(config.mysql);
            const [result] = await mysqlConn.execute(query, params);
            return result;
        }
        throw err;
    }
};

export const querry = (query, params) =>
    new Promise((resolve, reject) => {
        queryQueue.push({ query, params, resolve, reject });
        processQueryQueue();
    });

bus.on("querry", async ({ id, query, params }) => {
    try {
        const result = await querry(query, params);
        bus.emit("query:result", { id, result });
    } catch (err) {
        bus.emit("query:error", { id, error: err.message });
    }
});

bus.on("getTickets", async ({ id }) => {
    try {
        const tickets = await loadTickets();
        bus.emit(`getTickets:response:${id}`, tickets);
    } catch (err) {
        bus.emit(`getTickets:error:${id}`, { message: err.message });
    }
});

bus.on("saveTickets", async (tickets) => {
    try {
        await saveTickets(tickets);
        bus.emit("ticketsSaved");
    } catch (err) {
        bus.emit("saveTicketsError", err);
    }
});
