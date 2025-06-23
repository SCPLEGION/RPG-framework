// bot.js
console.time("Bot startup");

import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import config from '../config.js';
import { redirect, handleInteraction } from './modules/redirector.js';
import { querry } from '../utils/database.js';
import { bus } from '../utils/Commbus.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.timeEnd("Bot startup");

    setTimeout(() => {
        sendinfo().catch(console.error);
        fetchavatar("552543606012117012").then(x => console.log("Test avatar:", x));
    }, 1000);

    bus.emit('botReady', true);
});

client.on('messageCreate', redirect);
client.on('interactionCreate', handleInteraction);

client.login(process.env.DISCORD_TOKEN);

// ==========================
// Funkcje pomocnicze poni¿ej
// ==========================

async function sendinfo() {
    const guild = client.guilds.cache.get("1353825315117334668");
    if (!guild) return console.error("Guild not found");

    try {
        const members = await guild.members.fetch();
        const users = [];

        members.forEach(member => {
            users.push({
                id: member.user.id,
                username: member.user.username,
                displayName: member.displayName || member.user.globalName || member.user.username,
                discriminator: member.user.discriminator
            });
        });

        console.log(`[sendinfo] Found ${users.length} users. Saving to database...`);
        await saveUsersBatch(users);
    } catch (err) {
        console.error("sendinfo() failed:", err);
    }
}

async function saveUsersBatch(users) {
    if (users.length === 0) return;

    const values = users.map(u => [
        u.id,
        u.username,
        u.displayName,
        u.discriminator,
        'user',
        0
    ]);

    const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const flatParams = values.flat();

    const baseSql = `INSERT INTO users (id, username, displayName, discriminator, role, token) VALUES ${placeholders}`;
    const updateSql = config.storage === "sqlite"
        ? `
      ON CONFLICT(id) DO UPDATE SET
        username = excluded.username,
        displayName = excluded.displayName,
        discriminator = excluded.discriminator`
        : `
      ON DUPLICATE KEY UPDATE
        username = VALUES(username),
        displayName = VALUES(displayName),
        discriminator = VALUES(discriminator)`;

    const sql = baseSql + updateSql;

    if (config.storage === "mysql") {
        bus.emit('querry', { query: sql, params: flatParams });
    } else {
        await querry(sql, flatParams);
    }
}

export async function fetchavatar(userId) {
    try {
        const guilds = client.guilds.cache;
        for (const guild of guilds.values()) {
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) return member.user.displayAvatarURL();
        }
        throw new Error("User not found in any guild.");
    } catch (err) {
        console.error("Error fetching avatar:", err);
        return null;
    }
}

export async function sendmsg(channelId, msg) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) return console.error(`Channel ${channelId} not found`);
    channel.send(msg).catch(console.error);
}

export async function reply(to, msg) {
    try {
        await to.reply(msg);
        return true;
    } catch (err) {
        console.error("Error replying:", err);
        return null;
    }
}

bus.on('sendmsg', ({ channelId, msg }) => sendmsg(channelId, msg));
bus.on('error', err => console.error("CommunicationBus Error:", err));
