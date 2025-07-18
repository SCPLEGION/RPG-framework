// bot.js
console.time("Bot startup");

import { Client, GatewayIntentBits, Guild } from 'discord.js';
import dotenv from 'dotenv';
import config from '../config.js';
import { redirect, handleInteraction } from './modules/redirector.js';
import { querry } from '../utils/database.js';
import { bus } from '../utils/Commbus.js';
import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes, Collection } from 'discord.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const commands = [];
const commandsMap = new Collection();

const commandsPath = path.join(process.cwd(), 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

(async () => {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // @ts-ignore
        const command = await import(`file://${filePath}`);
        if (command.data && command.execute) {
            commands.push(command.data.toJSON());
            commandsMap.set(command.data.name, command);
        }
    }
})();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.timeEnd("Bot startup");

    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands('1354223087486505010'),
            { body: await commands }
        );
        console.log(`Registered ${commands.length} slash commands.`);
        commands.forEach(cmd => {
            console.log(`- ${cmd.name}: ${cmd.description}`);
        });
        // Register commands in the map for interaction handling
        console.log('Slash commands registered.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
    const guild = client.guilds.cache.get('1353825315117334668');
    await guild.commands.set(commands);
    setTimeout(() => {
        sendinfo().catch(console.error);
        fetchavatar("552543606012117012").then(x => console.log("Test avatar:", x));
    }, 1000);

    bus.emit('botReady', true);
});

client.on('messageCreate', redirect);
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandsMap.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        try {
            await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
        } catch (err) {
            // If the interaction has already been replied to or deferred, edit the reply (without ephemeral)
            await interaction.editReply({ content: 'There was an error executing this command!' });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

// ==========================
// Funkcje pomocnicze poni�ej
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
    // @ts-ignore
    channel.send(msg).catch(console.error);
    return true;
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

export async function listchannels(guildId) {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return console.error(`Guild ${guildId} not found`);

    const channels = guild.channels.cache.map(channel => ({
        id: channel.id,
        name: channel.name,
        type: channel.type
    }));

    return channels;
}

export function aifunctions() {
  return [
    {
      name: "get_current_time",
      description: "Returns the current server time in ISO format.",
      parameters: {},
      function: async () => {
        return { time: new Date().toISOString() };
      }
    },
    {
      name: "echo_message",
      description: "Echoes back the provided message.",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string", description: "The message to echo" }
        },
        required: ["message"]
      },
      function: async ({ message }) => {
        return { echoed: message };
      }
    },
    {
      name: "get_random_number",
      description: "Returns a random number between 1 and 100.",
      parameters: {},
      function: async () => {
        return { number: Math.floor(Math.random() * 100) + 1 };
      }
    },
    {
      name: "get_weather",
      description: "Returns a mock weather report for a given city.",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "The city to get the weather for" }
        },
        required: ["city"]
      },
      function: async ({ city }) => {
        return { weather: `Sunny in ${city} with a high of 25°C.` };
      }
    },
    {
      name: "wyslij_tekst",
      description: "Sends a text message to a specified channel.",
      parameters: {
        type: "object",
        properties: {
          channelId: { type: "string", description: "The ID of the channel to send the message to" },
          text: { type: "string", description: "The text message to send" }
        },
        required: ["channelId", "text"]
      },
      function: async ({ channelId, text }) => {
        sendmsg(channelId, text);
        console.log(`Message sent to channel ${channelId}: ${text}`);
        return { sent: `Message sent to channel ${channelId}: ${text}` };
      }
    },
    {
      name: "lista_kanaluw",
      description: "pokaż listę kanałów",
      parameters: {
        type: "object",
        properties: {
          guildid: { type: "string", description: "The ID of the guild to send the message to" }
        },
        required: ["guildid"]
      },
      function: async ({ guildid }) => {
        const channels = await listchannels(guildid);
        return { channels };
      }
    },
    {
        name: "get_all_guilds",
        description: "Returns a list of all guilds the bot is in.",
        parameters: {},
        function: async () => {
            const guilds = Array.from(client.guilds.cache.values()).map(guild => ({
                id: guild.id,
                name: guild.name
            }));
            return { guilds };
        }
    }
  ];
}


bus.on('reply', ({ to, msg }) => reply(to, msg));
bus.on('sendmsg', ({ channelId, msg }) => sendmsg(channelId, msg));
bus.on('error', err => console.error("CommunicationBus Error:", err));
