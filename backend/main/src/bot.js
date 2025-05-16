/**
 * Initializes the Discord bot client, sets up event listeners, and handles guild member data.
 * @file bot.js
 */

import { Client, GatewayIntentBits, Message } from 'discord.js';
import dotenv from 'dotenv';
import { redirect, handleInteraction } from './modules/redirector.js';
import { querry } from './modules/database.js';

/**
 * Saves a user's data to the database.
 * @async
 * @function savetodb
 * @param {Object} x - The user object.
 * @param {string} x.id - The user's ID.
 * @param {string} x.username - The user's username.
 * @param {string} x.discriminator - The user's discriminator (e.g., #1234).
 * @returns {Promise<void>} Resolves when the data is saved to the database.
 */

/**
 * Sends a message to a specific channel.
 * @function sendmsg
 * @param {string} channelId - The ID of the channel to send the message to.
 * @param {string} msg - The message content to send.
 * @returns {void}
 */

/**
 * Fetches the avatar URL of a user by their ID.
 * @async
 * @function fetchavatar
 * @param {string} userId - The ID of the user whose avatar is to be fetched.
 * @returns {Promise<string|null>} The avatar URL if found, or null if the user is not found.
 */

/**
 * Replying to message
 * @async
 * @function reply
 * @param {string} to - message to reply
 * @param {string} msg - text of reply
 * @returns {promise<string|null>}
 */


/**
 * Placeholder function for performing an action.
 * @async
 * @function action
 * @param {*} x - The first parameter for the action.
 * @param {*} y - The second parameter for the action.
 * @returns {Promise<void>} Resolves when the action is completed.
 */

/**
 * Event listener for the bot's ready event.
 * Logs the bot's login information and fetches guild member data.
 * @event Client#ready
 */

/**
 * Event listener for the messageCreate event.
 * Redirects incoming messages for further processing.
 * @event Client#messageCreate
 * @param {Message} message - The message object.
 */

/**
 * Event listener for the interactionCreate event.
 * Handles interactions such as slash commands or button clicks.
 * @event Client#interactionCreate
 * @param {import('discord.js').Interaction} interaction - The interaction object.
 */

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });



client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guild = client.guilds.cache.get("1353825315117334668");
    if (guild) {
        console.log(`Guild: ${guild.name}`);
        try {
            const members = await guild.members.fetch();
            members.forEach(member => {
                savetodb(member.user)
            });
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    } else {
        console.error("Guild not found.");
    }
    fetchavatar("552543606012117012").then((x) => {
        console.log("test",x);
    });
});

async function savetodb(x) {
    const { id, username, discriminator } = x;
    await querry(
        `INSERT INTO users (id, username, discriminator, role, token) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET username = ?, discriminator = ?`,
        [id, username, discriminator, 'user', 0, username, discriminator]
    );
}


client.on('messageCreate', (message) => {
    redirect(message);
});

client.on('interactionCreate', (interaction) => {
    handleInteraction(interaction);
});

export function sendmsg(channelId, msg) {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        // @ts-ignore
        channel.send(msg);
    } else {
        console.error(`Channel with ID ${channelId} not found.`);
    }
    
}

export async function fetchavatar(userId) {
    try {
        const guilds = client.guilds.cache;
        for (const guild of guilds.values()) {
            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) {
                return member.user.displayAvatarURL();
            }
        }
        throw new Error("User not found in any guild.");
    } catch (error) {
        console.error("Error fetching avatar:", error);
        return null;
    }
}

export async function reply(to,msg) {
	try {
		to.reply(msg)
		return true
	} catch (error) {
		console.error("Error replying: " + error)
		return null
	}
}

export async function action(x,y){
    
}


client.login(process.env.DISCORD_TOKEN);
